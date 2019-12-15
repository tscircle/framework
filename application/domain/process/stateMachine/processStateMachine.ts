import stateMachine from '../../../../stageMachine/stateMachine';
import {MachineConfig} from "xstate";
import {StateMachineRepository} from "../repositories/stateMachine";
import {StateMachineHistoryRepository} from "../repositories/stateMachineHistory";

export interface ProcessContext {
    amount: number;
    type: string;
}

export class processStateMachine extends stateMachine {

    protected smRepository = new StateMachineRepository();
    protected smHistoryRepository = new StateMachineHistoryRepository();

    public async create(context: ProcessContext) {
        return super.create(context);
    }

    protected config: MachineConfig<ProcessContext, any, any> = {
        id: 'quiet',
        initial: 'start',
        context: {
            amount: 0,
            type: ' yeah'
        },
        states: {
            start: {
                on: {
                    NEXT: 'waiting'
                }
            },
            waiting: {
                on: {
                    NEXT: 'paid'
                }
            },
            paid: {
                on: {
                    NEXT: 'finished'
                }
            },
            finished: {
                type: 'final'
            }
        }
    };
}
