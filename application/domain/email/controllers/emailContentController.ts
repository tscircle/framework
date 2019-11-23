import {CrudController} from "../../../../http/controllers/crudController";
import {emailContentSchema, editEmailContentSchema} from "../schemas/emailContentSchema";
import {EmailContentRepository} from "../repositories/emailContentRepository";
import {JwtAuth} from "../../../../auth/jwtAuth";


export class EmailContentController extends CrudController {

    constructor() {
        super("email/:parentId/emailContent", new EmailContentRepository());
        this.authProvider = new JwtAuth();
    }

    onStoreValidationSchema = emailContentSchema;
    onUpdateValidationSchema = editEmailContentSchema;
}

exports.restHandler = new EmailContentController().setupRestHandler();
