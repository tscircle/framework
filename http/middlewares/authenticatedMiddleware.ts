import {middlewareInterface} from "./middlewareInterface";

export class AuthenticatedMiddleware implements middlewareInterface {
    defaultError = {
        error: "not authenticated",
        status: 401
    };

    next = async (req, authenticatedUser,) => {
        if (!authenticatedUser) {
            Promise.reject(this.defaultError);
        }

        Promise.resolve();
    };
}
