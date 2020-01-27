import {AuthProviderInterface} from "../../auth/authProviderInterface";
import {middlewareInterface} from "../middlewares/middlewareInterface";
import * as Formidable from "formidable";
import {File} from "formidable";
import * as createError from "http-errors";
import {APIGatewayProxyResult} from "aws-lambda";

export interface ControllerException {
    status: number,
    error: object | string
}

export interface Headers {
    [header: string]: boolean | number | string;
};

export class BaseController {
    authenticatedUser?: Object;
    middlewares?: Array<middlewareInterface>;
    authProvider?: AuthProviderInterface;
    validationSchema?: Object;

    public prerequisites = (req) => {
        return this.authenticate(req)
            .then(() => {
                return this.checkMiddlewares(req, this.authenticatedUser);
            })
    };

    public authenticate = (req) => {
        return new Promise((resolve, reject) => {
            if (this.authProvider) {
                return this.authProvider.authenticate(req)
                    .then((user) => {
                        this.authenticatedUser = user;
                        resolve(user);
                    }).catch((error) => {
                        reject(error);
                    });
            }
            resolve('No auth provider configured');
        });
    };

    public checkMiddlewares = (req, authenticatedUser) => {
        let promises = Array();

        if (this.middlewares) {
            this.middlewares.forEach((middleware) => {
                promises.push(middleware.next(req, authenticatedUser));
            });
        }

        return Promise.all(promises);
    };

    public validate = (data, schema) => {
        if (!schema) {
            return data;
        }

        const {error} = schema.validate(data, {abortEarly: false});

        if (error) {
            throw <ControllerException>{
                status: 422,
                error: JSON.stringify(error.details)
            };
        } else {
            return data;
        }
    };

    public getFile = async (req): Promise<File> => {
        return new Promise(function (resolve, reject) {
            const form = new Formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if (err) return reject(err);
                resolve(files.file)
            })
        })
    };

    public handleError(error) {
        const errorMessage = error.error || error.Message;
        const statusCode = error.statusCode || error.status;

        if (statusCode) {
            throw createError(statusCode, errorMessage);
        } else {
            throw new createError.InternalServerError();
        }
    }

    public handleResponse(statusCode: number, response, headers?: Headers): APIGatewayProxyResult {
        return {
            statusCode: statusCode,
            body: JSON.stringify(response),
            headers
        };
    }
}
