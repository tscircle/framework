import {BaseRepository} from "../../../../repository/baseRepository";
import {EmailType} from "../models/emailTypeModel";

export class EmailTypeRepository extends BaseRepository{
    model = EmailType;
}
