import {idSchema} from "../../schemas/crudSchema";
import {BaseController} from "./baseController";
import {BaseRepository} from "../../repository/baseRepository";
import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import middy from "middy";
import { jsonBodyParser } from "middy/middlewares";

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
        
            const response = {
                statusCode: 405,
                body: JSON.stringify({
                    message: `Invalid HTTP Method: ${httpMethod}`
                }),
            };
        
            return Promise.resolve(response);
        }
         
        return middy(restHandler)
            .use(jsonBodyParser());
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

    public index = async () => {
        return this.prerequisites(this.event).then(async () => {
            const parentId: any = this.event.pathParameters && this.event.pathParameters.parentId;
            const searchQuery = this.event.queryStringParameters && this.event.queryStringParameters.searchQuery;
            const searchColumn = this.event.queryStringParameters && this.event.queryStringParameters.searchColumn;
            const response = await this.essence.getAll(searchQuery, searchColumn, parentId);

            return {
                statusCode: 200,
                body: JSON.stringify(response)
            };
        }).catch((error) => {
            //TODO HANDLER HTTP ERRORS
            return {
                statusCode: 500,
                body: error.error
            };
        });
    };

    public show = async () => {
        return this.prerequisites(this.event).then(async () => {
            const { id, parentId } = this.event.pathParameters

            this.validate({id: id}, idSchema);

            const response = await this.essence.get(parseInt(id), parseInt(parentId), this.event);

            return {
                statusCode: 200,
                body: JSON.stringify(response)
            };
        }).catch((error) => {
            //TODO HANDLER HTTP ERRORS
            return {
                statusCode: 500,
                body: error.error
            };
        });
    };

    public store = async () => {
        return this.prerequisites(this.event).then(async () => {
            const body = <unknown>this.event.body;

            this.validate(body, this.onStoreValidationSchema);

            const parentId = this.event.pathParameters && this.event.pathParameters.parentId;
            const response = await this.essence.add(<object>body, parseInt(parentId), this.event);
            
            return {
                statusCode: 201,
                body: JSON.stringify(response)
            };
        }).catch((error) => {
            //TODO HANDLER HTTP ERRORS
            return {
                statusCode: 500,
                body: error.error || error
            };
        });
    };

    public update = async () => {
        return this.prerequisites(this.event).then(async () => {
            const { id, parentId } = this.event.pathParameters;
            const body = <unknown>this.event.body;

            this.validate(body, this.onUpdateValidationSchema);
            
            const response = await this.essence.edit(parseInt(id), <object>body, parseInt(parentId), this.event);

            return {
                statusCode: 202,
                body: JSON.stringify(response)
            };
        }).catch((error) => {
            //TODO HANDLER HTTP ERRORS
            return {
                statusCode: 500,
                body: error.error
            };
        });
    };

    public remove = async () => {
        return this.prerequisites(this.event).then(async () => {
            const { id, parentId } = this.event.pathParameters;

            this.validate({id: id}, idSchema);
            const response = await this.essence.delete(parseInt(id), parseInt(parentId), this.event);

            return {
                statusCode: 204,
                body: JSON.stringify(response)
            };
        }).catch((error) => {
            //TODO HANDLER HTTP ERRORS
            return {
                statusCode: 500,
                body: error.error
            };
        });
    };
};