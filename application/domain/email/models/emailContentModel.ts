import { BaseModel } from "../../../../model/baseModel";

export interface EmailContentInterface {
    id: number;
    name: string;
}

export class EmailContent extends BaseModel {
    public static tableName: string = "email_content";
    public static parentIdColumn: string = "email_id";
}
