import {BaseRepository} from "../../../../repository/baseRepository";
import {Email, EmailInterface} from "../models/emailModel";
import {APIGatewayEvent} from "aws-lambda";
import * as createError from "http-errors";

export class EmailRepository extends BaseRepository {
    model = Email;

    public getEmailsByTeamId = async (event: APIGatewayEvent) => {
        const teamId = event.pathParameters && event.pathParameters.teamId; 

        if (!teamId) {
            throw new createError.BadRequest('missing teamId parameter');
        }

        return Email.q().where({team_id: teamId});
    };

    public uploadFile = async (event: APIGatewayEvent) => {
        return event.body;
    };
}
