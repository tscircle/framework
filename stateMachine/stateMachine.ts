import { MachineConfig, MachineOptions, Machine, State, interpret, Interpreter, StateValue } from 'xstate';
import { StateMachineRepository } from "./repositories/stateMachineRepository";
import { StateMachineHistoryRepository } from "./repositories/stateMachineHistoryRepository";

export default abstract class stateMachine {
    protected abstract config: MachineConfig<any, any, any>;
    protected abstract options: MachineOptions<any, any>;
    protected smRepository: StateMachineRepository = new StateMachineRepository();
    protected smHistoryRepository: StateMachineHistoryRepository = new StateMachineHistoryRepository();
    protected id: number;
    protected sm;
    protected smInstance;
    public state: State<any>;
    public service: Interpreter<any>;
    protected smName: string;

    public async create(context: Object): Promise<any> {
        this.sm = Machine(this.config, this.options);
        this.smInstance = this.sm.withContext(context);
        this.state = this.smInstance.initialState;

        this.service = interpret(this.sm).start(this.state).onTransition(async (state) => {
            this.state = state;
            await this.store().catch((err) => err)
        })

        const model = await this.smRepository.addMachine(this.smName, this.state);
        await this.smHistoryRepository.addMachineHistory(model.id, this.state);

        this.id = model.id;
    }

    public getId() {
        if (!this.smInstance) {
            throw new Error('No state machine instance found');
        }

        return this.id;
    }

    public getStatus(): StateValue {
        if (!this.smInstance) {
            throw new Error('No state machine instance found');
        }

        return this.state.value;
    }

    public async load(id: number) {
        this.sm = Machine(this.config);
        const data = await this.smRepository.get(id);

        if (data.filename !== this.smName) {
            throw new Error('State machine does not belong to class');
        }

        this.state = State.create(JSON.parse(data.state_object));
        this.smInstance = this.sm.resolveState(this.state);

        this.service = interpret(this.sm).start(this.state).onTransition(async (state) => {
            this.state = state;
            await this.store().catch((err) => err)
        })

        this.id = id;
    }

    public async transition(event: string) {
        if (!this.smInstance) {
            throw new Error('No state machine instance found');
        }

        this.state = this.smInstance.transition(this.state, event);

        await this.store();
    }

    protected async store() {
        await this.smRepository.editStateMachine(this.id, this.state);
        await this.smHistoryRepository.addMachineHistory(this.id, this.state);
    }
}
