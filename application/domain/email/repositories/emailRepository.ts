import {BaseRepository} from "../../../../repository/baseRepository";
import {Email} from "../models/emailModel";
import {EmailContentRepository} from "./emailContentRepository";

export class EmailRepository extends BaseRepository {
    model = Email;

}
