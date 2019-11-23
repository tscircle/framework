import { CrudController } from "../../../../http/controllers/crudController";
import { emailContentSchema, editEmailContentSchema } from "../schemas/emailContentSchema";
import {EmailContentRepository} from "../repositories/emailContentRepository";
import {JwtAuth} from "../../../../auth/jwtAuth";
import {AuthUserProvider} from "../../user/services/authUserProvider";
import {RESTMiddleware} from "../../../http/middlewares/RESTMiddleware";


export class EmailContentController extends CrudController {

    authProvider = new JwtAuth(new AuthUserProvider());
    middlewares = [new RESTMiddleware(new EmailContentRepository())];

    constructor() {
        super("email/:parentId/emailContent", new EmailContentRepository());
    }

    onStoreValidationSchema = emailContentSchema;
    onUpdateValidationSchema = editEmailContentSchema;
}

exports.restHandler = new EmailContentController().setupRestHandler();
