import {BaseRepository} from "../../../../repository/baseRepository";
import {Email} from "../models/emailModel";
import {APIGatewayEvent} from "aws-lambda";

export class EmailRepository extends BaseRepository {
    model = Email;

}
