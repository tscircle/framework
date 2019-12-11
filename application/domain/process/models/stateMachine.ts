import {BaseModel} from "../../../../model/baseModel";

export interface StateMachineModelInterface {
    id: number;
    currentState: string;
}

export class StateMachineModel extends BaseModel {
    public static tableName: string = "state_machine";
}
