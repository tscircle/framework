export interface middlewareInterface {
    next(req, authenticatedUser);
}
