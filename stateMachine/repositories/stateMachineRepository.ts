import {BaseRepository} from "../../repository/baseRepository";
import {StateMachineModel} from "../models/stateMachineModel";
import {State} from "xstate";

export class StateMachineRepository extends BaseRepository {
    model = StateMachineModel;

    public async addMachine(stateMachineClass: string, state: State<any, any, any>): Promise<any> {
        return this.add({
            filename: stateMachineClass,
            state: state.value,
            done: state.done,
            state_object: JSON.stringify(state)
        });
    }

    public async editStateMachine(stateMachineId: number, state: State<any, any, any>): Promise<any> {
        return this.edit(stateMachineId, {
            state: state.value,
            done: state.done,
            state_object: JSON.stringify(state)
        });
    }
}
