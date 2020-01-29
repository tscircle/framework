import {CrudController} from "../../../../http/controllers/crudController";
import {emailSchema, editEmailSchema} from "../schemas/emailSchema";
import {EmailRepository} from "../repositories/emailRepository";

export class EmailController extends CrudController {

    constructor() {
        super(new EmailRepository());
    }

    onStoreValidationSchema = emailSchema;
    onUpdateValidationSchema = editEmailSchema;
}

exports.restHandler = new EmailController().setupRestHandler();
