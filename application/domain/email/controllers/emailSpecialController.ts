import {BaseController} from '../../../../http/controllers/baseController';


export class EmailSpecialController extends BaseController {

    constructor() {
        super('get', 'email/:parentId/special');
    }

    public handler = async (req): Promise<Object> => {
        return {
            hello: 'from EmailSpecialController'
        };
    };
}

exports.restHandler = new EmailSpecialController().setupRestHandler();
