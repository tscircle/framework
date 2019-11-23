import {CrudController} from "../../../../http/controllers/crudController";
import {emailTypeSchema, editEmailTypeSchema} from "../schemas/emailTypeSchema";
import {EmailTypeRepository} from "../repositories/emailTypeRepository";
import {JwtAuth} from "auth/jwtAuth";

export class EmailTypeController extends CrudController {

    constructor() {
        super("emailType", new EmailTypeRepository());
        this.authProvider = new JwtAuth();
    }

    onStoreValidationSchema = emailTypeSchema;
    onUpdateValidationSchema = editEmailTypeSchema;
}

exports.restHandler = new EmailTypeController().setupRestHandler();
