import stateMachine from '../../../../stateMachine/stateMachine';
import { MachineConfig, MachineOptions } from "xstate";
import { Config } from 'knex';

export interface ProcessContext {
    id?: number | null
    amount: number;
    type: string;
}

const config: MachineConfig<ProcessContext, any, any> = {
    id: 'debitPayment',
    initial: 'started',
    context: {
        id: null,
        amount: 0,
        type: 'debit'
    },
    states: {
        started: {
            on: {
                NEXT: { target: 'paid', cond: 'isPaid' }
            }
        },
        paid: {
            on: {
                NEXT: { target: 'finished', cond: 'isDisputed' }
            }
        },
        finished: {
            type: 'final'
        }
    },



};

const options: MachineOptions<ProcessContext, any> = {
    guards: {
        isPaid: (context, event) => {
            // check if paid
            return true;
        },
        isDisputed: (context, event) => {
            // check if disputed
            return false
        }
    },
    actions: {},
    activities: {},
    services: {},
    delays: {}
}

export class processStateMachine3 extends stateMachine {
    protected config = config;
    protected options = options;

    constructor(context: ProcessContext, smName: string) {
        super()
        if (context.id) {
            this.load(context.id, smName);
        } else {
            this.create(context, smName);
        }
    }
}
