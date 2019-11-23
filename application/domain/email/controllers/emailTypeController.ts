import { CrudController } from "../../../../http/controllers/crudController";
import { emailTypeSchema, editEmailTypeSchema } from "../schemas/emailTypeSchema";
import {EmailTypeRepository} from "../repositories/emailTypeRepository";
import {JwtAuth} from "auth/jwtAuth";

export class EmailTypeController extends CrudController {

    authProvider = new JwtAuth();

    constructor() {
        super("emailType", new EmailTypeRepository());
    }

    onStoreValidationSchema = emailTypeSchema;
    onUpdateValidationSchema = editEmailTypeSchema;
}

exports.restHandler = new EmailTypeController().setupRestHandler();
