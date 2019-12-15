import {BaseModel} from "../../../../model/baseModel";

export interface StateMachineModeHistoryModelInterface {
    id: number;
    state_machine_id: number;
    state: string;
    state_object: string;
}

export class StateMachineModeHistoryModel extends BaseModel {
    public static tableName: string = "state_machine_history";
    public static parentIdColumn: string = "state_machine_id";
}
