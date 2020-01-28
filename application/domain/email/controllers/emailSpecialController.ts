import {CrudController, CustomRoute} from "../../../../http/controllers/crudController";
import {EmailRepository} from "../repositories/emailRepository";
import {HttpMethods} from '../../../../http/types/httpMethods';


export class EmailSpecialController extends CrudController {
    repository: EmailRepository; 

    constructor() {
        super(new EmailRepository());

        this.repository = new EmailRepository();
    }

    get customRoutes(): CustomRoute[] {
        return [
            {
                route: '/email/teams/{teamId}',
                httpMethod: HttpMethods.GET,
                method: this.repository.getEmailsByTeamId
            },
            {
                route: '/email/upload',
                httpMethod: HttpMethods.POST,
                method: this.repository.uploadFile
            }
        ]
    } 

}

exports.restHandler = new EmailSpecialController().setupRestHandler();;
