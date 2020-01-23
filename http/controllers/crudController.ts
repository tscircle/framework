import {idSchema} from "../../schemas/crudSchema";
import {BaseController} from "./baseController";
import {BaseRepository} from "../../repository/baseRepository";
import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import middy from "middy";
import { jsonBodyParser, httpErrorHandler } from "middy/middlewares";
import createError, { HttpError } from "http-errors";

export class CrudController extends BaseController {
    route: string;
    collectionHandlers: object;
    event: APIGatewayEvent;
    itemHandlers: object;
    essence: BaseRepository;

    onStoreValidationSchema: object;
    onUpdateValidationSchema: object;

    constructor(route: string, essence: BaseRepository) {
        super(route);

        this.essence = essence;
        this.route = route;
    }

    public setupRestHandler() {
        this.setupAPIHandler();
        
        const restHandler =  async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
            this.event = event;
            const handlers = (event["pathParameters"] == null) ? this.collectionHandlers : this.itemHandlers;
            const httpMethod = event["httpMethod"];

            if (httpMethod in handlers) {
                return handlers[httpMethod]();
            }
        
            throw new createError.MethodNotAllowed();
        }
         
        return middy(restHandler)
            .use(jsonBodyParser())
            .use(httpErrorHandler());
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
        }
    }

    public index = async (): Promise<APIGatewayProxyResult> => {
        try {
            await this.prerequisites(this.event);
            const parentId: any = this.event.pathParameters && this.event.pathParameters.parentId;
            const searchQuery = this.event.queryStringParameters && this.event.queryStringParameters.searchQuery;
            const searchColumn = this.event.queryStringParameters && this.event.queryStringParameters.searchColumn;
            const response = await this.essence.getAll(searchQuery, searchColumn, parentId, this.event);

            return this.handleResponse(200, response);
        } catch(error) {
            this.handleError(error);
        }
    };

    public show = async (): Promise<APIGatewayProxyResult> => {
        try {
            await this.prerequisites(this.event);
            const { id, parentId } = this.event.pathParameters

            this.validate({id: id}, idSchema);

            const response = await this.essence.get(parseInt(id), parseInt(parentId), this.event);

            return this.handleResponse(200, response);
        } catch(error) {
            this.handleError(error);
        }
    };

    public store = async (): Promise<APIGatewayProxyResult> => {
        try {
            await this.prerequisites(this.event);
            const body = <unknown>this.event.body;

            this.validate(body, this.onStoreValidationSchema);

            const parentId = this.event.pathParameters && this.event.pathParameters.parentId;
            const response = await this.essence.add(<object>body, parseInt(parentId), this.event);
            
            return this.handleResponse(201, response);
        } catch(error) {
            this.handleError(error);
        }
    };

    public update = async (): Promise<APIGatewayProxyResult> => {
        try {
            await this.prerequisites(this.event);
            const { id, parentId } = this.event.pathParameters;
            const body = <unknown>this.event.body;

            this.validate(body, this.onUpdateValidationSchema);
            
            const response = await this.essence.edit(parseInt(id), <object>body, parseInt(parentId), this.event);

            return this.handleResponse(202, response);
        } catch(error) {
            this.handleError(error);
        }
    };

    public remove = async (): Promise<APIGatewayProxyResult> => {
        try {
            await this.prerequisites(this.event);
            const { id, parentId } = this.event.pathParameters;

            this.validate({id: id}, idSchema);
            const response = await this.essence.delete(parseInt(id), parseInt(parentId), this.event);

            return this.handleResponse(204, response);
        } catch(error) {
            this.handleError(error);
        }
    };

    private handleError(error) {
        const errorMessage = error.error || error.Message;
        const statusCode = error.statusCode || error.status;

        if (statusCode) {
            throw createError(statusCode, errorMessage);
        } else {
            throw new createError.InternalServerError();
        }
    }

    private handleResponse(statusCode: number, response): APIGatewayProxyResult {
        return {
            statusCode: statusCode,
            body: JSON.stringify(response)
        };
    }
};