import { BaseModel } from "../../../../model/baseModel";

export interface EmailInterface {
    id?: number;
    name: string;
}

export class Email extends BaseModel {
    public static tableName: string = "email";
    public static parentIdColumn: string = "email_type_id";
}
