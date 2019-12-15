import {BaseModel} from "../../model/baseModel";

export interface StateMachineModelInterface {
    id: number;
    state: string;
    state_object: string;
    done: boolean;
}

export class StateMachineModel extends BaseModel {
    public static tableName: string = "state_machine";
}
