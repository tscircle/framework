import {BaseController} from '../../../../http/controllers/baseController';
import {emailContentSchema} from "../schemas/emailContentSchema";


export class EmailSpecialPostController extends BaseController {

    constructor() {
        super('email/:parentId/special');
    }

    validationSchema = emailContentSchema;

    public handler = async (req): Promise<Object> => {
        return {
            hello: 'from EmailSpecialController'
        };
    };
}

exports.restHandler = new EmailSpecialPostController().setupRestHandler();
