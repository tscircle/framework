import {AuthProviderInterface} from "../../auth/authProviderInterface";
import {middlewareInterface} from "../middlewares/middlewareInterface";
import {BaseRepository} from "../../repository/baseRepository";


export interface ControllerException {
    status: number,
    error: object
}

export class baseController {

    authenticatedUser: any;
    middlewares: Array<middlewareInterface>;
    authProvider: AuthProviderInterface;

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
                        console.log(this.authenticatedUser, 'authenticatedUser');
                        resolve(user);
                    }).catch((error) => {
                        reject(error);
                    });
            }
            resolve('No authentication');
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
}
