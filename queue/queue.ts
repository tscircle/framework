import * as ESSerializer from 'esserializer';
import { FailedJob } from './failedJob';
import * as path from "path";
import { glob } from 'glob';

const AWS = require('aws-sdk');

import getConfig from "../config/config";

const config = getConfig('queue');

const currentConf = config[config.default];

AWS.config.update({
    region: currentConf.region,
    endpoint: currentConf.endpoint
});

const sqs = new AWS.SQS();

const MAX_TRY_COUNTS = currentConf.max_tries;

export class Queue {

    public static dispatch(jobClass) {

        const serializeClass = ESSerializer.serialize(jobClass);
        const params = {
            MessageBody: serializeClass,
            QueueUrl: currentConf.endpoint
        };

        return sqs.sendMessage(params).promise()
            .catch((err) => {
                console.log("Error", err);
            });
    }

    public static handleMessages(messages) {
        let promises = Array();

        messages.forEach((message) => {
            promises.push(
                this.handleMessage(message)
            );
        });

        return Promise.all(promises);
    }

    private static async handleMessage(message) {

        const job = ESSerializer.deserialize(message.Body, this.getAllJobClasses());

        try {
            await job.handle();

            const deleteParams = {
                QueueUrl: currentConf.endpoint,
                ReceiptHandle: message.ReceiptHandle
            };

            return await sqs.deleteMessage(deleteParams).promise();
        } catch (err) {
            const payload = {
                name: JSON.parse(message.Body)['className'],
                payload: message.Body,
                error: err.stack
            };

            if (!message.Attributes) {
                return await FailedJob.create(payload);
            }

            const receiveCount = +message.Attributes.ApproximateReceiveCount;
            if (receiveCount === undefined || receiveCount > MAX_TRY_COUNTS) {
                return await FailedJob.create(payload);
            }
        }
    }

    private static getAllJobClasses() {
        let classes = Array();

        const files = glob.sync(config.jobsPath);

        files.forEach(file => {
            const relFilePath = path.relative(__dirname, '/' + process.cwd()) + '/' + file;
            const module = require(relFilePath);
            classes.push(module[Object.keys(module)[0]]);
        });

        return classes;
    }

    //only used for local env
    //in an AWS env the sqs queue should trigger lambda functions automatically
    public static fetchJobs() {
        const params = {
            QueueUrl: currentConf.endpoint,
            VisibilityTimeout: 40,
            WaitTimeSeconds: 0,
            AttributeNames: ['All']
        };

        return sqs.receiveMessage(params).promise()
            .then((data) => {
                if (data.Messages) {
                    return this.handleMessages(data.Messages);
                }
            })
            .catch((error) => {
                console.log('Error', error);
            });
    }

    public static getQueueAttributes(): Promise<Object> {
        const params = {
            QueueUrl: currentConf.endpoint,
            AttributeNames: [
                'ApproximateNumberOfMessages',
                'ApproximateNumberOfMessagesNotVisible',
                'ApproximateNumberOfMessagesDelayed'
            ]
        };

        return new Promise((resolve, reject) => {
            sqs.getQueueAttributes(params, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.Attributes);
            });
        })
    }
}
