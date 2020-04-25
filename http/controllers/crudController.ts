import { idSchema } from "../../schemas/crudSchema";
import { BaseController } from "./baseController";
import { BaseRepository } from "../../repository/baseRepository";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import * as middy from "middy";
import * as _ from 'lodash';
import {
    jsonBodyParser,
    httpErrorHandler,
    cors,
    httpMultipartBodyParser,
} from "middy/src/middlewares";
import * as createError from "http-errors";

export interface CustomRoute {
    route: string,
    httpMethod: string,
    method(event: APIGatewayEvent): Promise<APIGatewayProxyResult>
}

export class CrudController extends BaseController {
    collectionHandlers: object;
    event: APIGatewayEvent;
    itemHandlers: object;
    essence: BaseRepository;

    customRoutes?: CustomRoute[] | undefined;
    onStoreValidationSchema: object;
    onUpdateValidationSchema: object;

    constructor(essence: BaseRepository) {
        super();


        this.essence = essence;
    }

    public setupRestHandler() {
        this.setupAPIHandler();

        const restHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

            this.event = event;
            const hasParentId = event["pathParameters"] && event["pathParameters"].parentId;
            const hasId = event["pathParameters"] && event["pathParameters"].id;
            const isCollection = (hasParentId && !hasId) || (!hasParentId && !hasId) || !event["pathParameters"];
            const handlers = (isCollection) ? this.collectionHandlers : this.itemHandlers;
            const resource = event["resource"];
            const httpMethod = event["httpMethod"];

            if (this.customRoutes && this.customRoutes.length > 0) {
                const foundCustomRoute = this.customRoutes.find((customRoute) => {
                    return customRoute.httpMethod === httpMethod && customRoute.route === resource;
                });

                if (foundCustomRoute && foundCustomRoute.method) {
                    return this.custom(foundCustomRoute.method);
                }
            }

            if (httpMethod in handlers) {
                return handlers[httpMethod]();
            }

            throw new createError.MethodNotAllowed();
        }

        return middy(restHandler)
            .use(jsonBodyParser())
            .use(httpErrorHandler())
            .use(httpMultipartBodyParser())
            .use(cors());
    }

    public setupAPIHandler() {
        this.collectionHandlers = {
            "GET": this.index,
            "POST": this.store,
        }

        this.itemHandlers = {
            "DELETE": this.remove,
            "GET": this.show,
            "PUT": this.update,
            "POST": this.store
        }
    }

    public index = async (): Promise<APIGatewayProxyResult | undefined> => {
        let parentId, searchQuery, searchColumn;
        try {
            await this.prerequisites(this.event);
            parentId = _.get(this.event, 'pathParameters.parentId');
            searchQuery = _.get(this.event, 'queryStringParameters.searchQuery');
            searchColumn = _.get(this.event, 'queryStringParameters.searchColumn');
        } catch (error) {
            this.handleError(error);
        }
        try {
            const response = await this.essence.getAll(searchQuery, searchColumn, parentId, this.event);

            return this.hasHandleResponse ? response : this.handleResponse(200, response);
        } catch (error) {
            if (this.hasHandleResponse) {
                throw error;
            }
            this.handleError(error);
        }
    };

    public show = async (): Promise<APIGatewayProxyResult | undefined> => {
        let parentId, id;
        try {
            await this.prerequisites(this.event);
            parentId = _.get(this.event, 'pathParameters.parentId');
            id = _.get(this.event, 'pathParameters.id');
            this.validate({ id: id }, idSchema);
        } catch (error) {
            this.handleError(error);
        }
        try {
            const response = await this.essence.get(parseInt(id), parseInt(parentId), this.event);

            return this.hasHandleResponse ? response : this.handleResponse(200, response);
        } catch (error) {
            if (this.hasHandleResponse) {
                throw error;
            }
            this.handleError(error);
        }
    };

    public store = async (): Promise<APIGatewayProxyResult | undefined> => {
        let parentId, body;
        try {
            await this.prerequisites(this.event);
            body = <unknown>this.event.body;

            this.validate(body, this.onStoreValidationSchema);

            parentId = _.get(this.event, 'pathParameters.parentId');
        } catch (error) {
            this.handleError(error);
        }
        try {
            const response = await this.essence.add(<object>body, parseInt(parentId), this.event);

            return this.hasHandleResponse ? response : this.handleResponse(201, response);
        } catch (error) {
            if (this.hasHandleResponse) {
                throw error;
            }
            this.handleError(error);
        }
    };

    public update = async (): Promise<APIGatewayProxyResult | undefined> => {
        let parentId, id, body;
        try {
            await this.prerequisites(this.event);
            parentId = _.get(this.event, 'pathParameters.parentId');
            id = _.get(this.event, 'pathParameters.id');
            body = <unknown>this.event.body;
            this.validate(body, this.onUpdateValidationSchema);
        } catch (error) {
            this.handleError(error);
        }
        try {
            const response = await this.essence.edit(parseInt(id), <object>body, parseInt(parentId), this.event);

            return this.hasHandleResponse ? response : this.handleResponse(202, response);
        } catch (error) {
            if (this.hasHandleResponse) {
                throw error;
            }
            this.handleError(error);
        }
    };

    public remove = async (): Promise<APIGatewayProxyResult | undefined> => {
        let parentId, id;
        try {
            await this.prerequisites(this.event);
            parentId = _.get(this.event, 'pathParameters.parentId');
            id = _.get(this.event, 'pathParameters.id');

            this.validate({ id: id }, idSchema);
        } catch (error) {
            this.handleError(error);
        }
        try {
            const response = await this.essence.delete(parseInt(id), parseInt(parentId), this.event);

            return this.hasHandleResponse ? response : this.handleResponse(204, response);
        } catch (error) {
            if (this.hasHandleResponse) {
                throw error;
            }
            this.handleError(error);
        }
    };

    public custom = async (method: (event: APIGatewayEvent) => any) => {
        try {
            await this.prerequisites(this.event);
        } catch (error) {
            this.handleError(error);
        }
        return await method(this.event);
    }
};