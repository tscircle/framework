import {BaseModel} from "../../../../model/baseModel";
import {EmailType} from './emailTypeModel';

export interface EmailInterface {
    id?: number;
    name: string;
}

export class Email extends BaseModel {
    public static tableName: string = "email";
    public static parentIdColumn: string = "email_type_id";
    public static parentModel = EmailType;
    public static parentTakeOverColumns = [{
        source: 'team_id',
        target: 'team_id'
    }];
}
