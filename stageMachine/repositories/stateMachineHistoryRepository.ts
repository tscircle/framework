import {BaseRepository} from "../../repository/baseRepository";
import {StateMachineModeHistoryModel} from "../models/stateMachineHistoryModel";
import {State} from "xstate";


export class StateMachineHistoryRepository extends BaseRepository {
    model = StateMachineModeHistoryModel;


    public async addMachineHistory(stateMachineId: number, state: State<any, any, any>): Promise<any> {
        return this.add({
            state: state.value,
            state_object: JSON.stringify(state)
        }, stateMachineId)
    }
}
