import {AuthProviderInterface} from "../../auth/authProviderInterface";
import {middlewareInterface} from "../middlewares/middlewareInterface";
import * as createError from "http-errors";
import {APIGatewayProxyResult} from "aws-lambda";
import * as _ from "lodash";

export interface ControllerException {
    status?: number,
    statusCode?: number,
    Message?: string,
    message?: string,
    error?: any,
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
                error: error.details
            };
        } else {
            return data;
        }
    };

    public handleResponse(statusCode: number, response, headers?: Headers): APIGatewayProxyResult {
        response = _.isObjectLike(response) ? JSON.stringify(response) : response;

        return {
            statusCode: statusCode,
            body: response,
            ...(headers && {headers})
        };
    }
}
