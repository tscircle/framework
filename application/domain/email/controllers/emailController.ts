import {CrudController} from "../../../../http/controllers/crudController";
import {emailSchema, editEmailSchema} from "../schemas/emailSchema";
import {EmailRepository} from "../repositories/emailRepository";
import {JwtAuth} from "../../../../auth/jwtAuth";

export class EmailController extends CrudController {

    constructor() {
        super("emailType/:parentId/email", new EmailRepository());
        this.authProvider = new JwtAuth();
    }

    onStoreValidationSchema = emailSchema;
    onUpdateValidationSchema = editEmailSchema;
}

exports.restHandler = new EmailController().setupRestHandler();