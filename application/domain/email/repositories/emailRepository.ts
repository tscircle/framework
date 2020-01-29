import {BaseRepository} from "../../../../repository/baseRepository";
import {Email} from "../models/emailModel";
import {APIGatewayEvent, APIGatewayProxyResult} from "aws-lambda";
import * as createError from "http-errors";

export class EmailRepository extends BaseRepository {
    model = Email;

    public getEmailsByTeamId = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
        const teamId = event.pathParameters && event.pathParameters.teamId; 

        if (!teamId) {
            throw new createError.BadRequest('missing teamId parameter');
        }

        const response = await Email.q().where({team_id: teamId});

        return {
            body: JSON.stringify(response),
            statusCode: 200
        } 
    };

    public uploadFile = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {

        return {
            body: JSON.stringify(event.body),
            statusCode: 200,
        };
    };
}
