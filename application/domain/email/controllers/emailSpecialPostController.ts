import {CrudController} from "../../../../http/controllers/crudController";
import {emailSchema} from "../schemas/emailSchema";
import {EmailRepository} from "../repositories/emailRepository";


export class EmailSpecialPostController extends CrudController {

    constructor() {
        super(new EmailRepository());
    }
    
    onStoreValidationSchema = emailSchema;
}

exports.restHandler = new EmailSpecialPostController().setupRestHandler();
