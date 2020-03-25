import stateMachine from '../../../../stateMachine/stateMachine';
import { MachineConfig } from "xstate";

export interface ProcessContext {
    amount: number;
    type: string;
}

export class processStateMachine2 extends stateMachine {

    public async create(context: ProcessContext) {
        return super.create(context);
    }

    protected options: any;

    protected smName: string = 'processStateMachine2';

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
