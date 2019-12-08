import {AuthProviderInterface} from "../../auth/authProviderInterface";
import {middlewareInterface} from "../middlewares/middlewareInterface";
import * as Formidable from "formidable";
import {File} from "formidable";

const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

export interface ControllerException {
    status: number,
    error: object
}

export class BaseController {
    route: string;
    method: string;
    authenticatedUser?: Object;
    middlewares?: Array<middlewareInterface>;
    authProvider?: AuthProviderInterface;
    validationSchema?: Object;

    constructor(method: string, route: string) {
        this.method = method;
        this.route = route;
    }

    public setupRestHandler() {
        this.setupAPIHandler();

        return serverless(app);
    }

    public setupAPIHandler() {
        const {route} = this;

        app[this.method](`/${route}`, this.index);

        return app;
    }

    public handler = async (req): Promise<Object> => {
        return {hello: 'world'};
    };

    public index = async (req, res) => {
        return this.prerequisites(req).then(async () => {
            if (this.validationSchema) {
                this.validate(req.body, this.validationSchema);
            }
            return res.json(await this.handler(req));
        }).catch((error) => {
            res.status(error.status || 500).send(error.error);
        });
    };

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

    public getFile = async (req): Promise<File> => {
        return new Promise(function (resolve, reject) {
            const form = new Formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if (err) return reject(err);
                resolve(files.file)
            })
        })
    };
}
