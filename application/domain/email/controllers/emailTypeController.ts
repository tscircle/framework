import { CrudController } from "../../../../http/controllers/crudController";
import { emailTypeSchema, editEmailTypeSchema } from "../schemas/emailTypeSchema";
import {EmailTypeRepository} from "../repositories/emailTypeRepository";

export class EmailTypeController extends CrudController {
    constructor() {
        super("project/:parentId/emailType", new EmailTypeRepository());
    }

    onStoreValidationSchema = emailTypeSchema;
    onUpdateValidationSchema = editEmailTypeSchema;
}

exports.restHandler = new EmailTypeController().setupRestHandler();
