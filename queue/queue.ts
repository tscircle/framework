import * as ESSerializer from 'esserializer';
import { FailedJob } from './failedJob';

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

class Serializer {
    types: Array<any>;

    constructor(types) { this.types = types; }
    serialize(object) {
        let idx = this.types.findIndex((e) => { return e.name ? e.name : e[Object.keys(e)[0]].name == object.constructor.name; });
        if (idx == -1) throw "type  '" + object.constructor.name + "' not initialized";
        return JSON.stringify([idx, Object.entries(object)]);
    }
    deserialize(jstring) {
        let array = JSON.parse(jstring);
        let object = this.types[array[0]][Object.keys(this.types[array[0]])[0]] ? new this.types[array[0]][Object.keys(this.types[array[0]])[0]]() : new this.types[array[0]]();
        array[1].map(e => { object[e[0]] = e[1]; });
        return object;
    }
}

export class Queue {

    public static classes: Array<any> = [];

    public static dispatch(jobClass, payload) {

        this.classes.indexOf(jobClass) === -1 ? this.classes.push(jobClass) : false;
        const serializer = new Serializer(this.classes);

        const instance = jobClass.name ? new jobClass(payload) : new jobClass[Object.keys(jobClass)[0]](payload);

        const serializeClass = serializer.serialize(instance);
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
        const messageBody = message.Body ? message.Body : message.body;
        const serializer = new Serializer(this.classes);

        const job = serializer.deserialize(messageBody);

        try {
            await job.handle();

            const deleteParams = {
                QueueUrl: currentConf.endpoint,
                ReceiptHandle: message.ReceiptHandle
            };

            return await sqs.deleteMessage(deleteParams).promise();
        } catch (err) {
            const messageBody = message.Body ? message.Body : message.body;

            const payload = {
                name: JSON.parse(messageBody)['className'],
                payload: messageBody,
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
