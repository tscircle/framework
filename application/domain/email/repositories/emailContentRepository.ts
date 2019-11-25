import {BaseRepository} from "../../../../repository/baseRepository";
import {EmailContent} from "../models/emailContentModel";

export class EmailContentRepository extends BaseRepository {
    model = EmailContent;
}
