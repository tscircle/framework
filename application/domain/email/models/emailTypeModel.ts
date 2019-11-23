import { BaseModel } from "../../../../model/baseModel";

export interface EmailTypeInterface {
    id: number;
    name: string;
}

export class EmailType extends BaseModel {
    public static tableName: string = "email_type";
    public static parentIdColumn: string = "project_id";
}
