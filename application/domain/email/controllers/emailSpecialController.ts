import {CrudController} from "../../../../http/controllers/crudController";
import {EmailRepository} from "../repositories/emailRepository";


export class EmailSpecialController extends CrudController {

    constructor() {
        super(new EmailRepository());
    }

}

exports.restHandler = new EmailSpecialController().setupRestHandler();
