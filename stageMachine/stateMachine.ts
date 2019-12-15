import {MachineConfig, Machine, State} from 'xstate';
import {BaseRepository} from "../repository/baseRepository";

export default abstract class stateMachine {
    protected abstract smRepository: BaseRepository;
    protected abstract smHistoryRepository: BaseRepository;
    protected abstract config: MachineConfig<any, any, any>;
    protected id: number;
    protected sm;
    protected smInstance;
    protected state;


    public async create(context: Object): Promise<any> {
        this.sm = Machine(this.config);
        this.smInstance = this.sm.withContext(context);
        this.state = this.smInstance.initialState;

        const model = await this.smRepository.add({
            filename: __filename,
            state: this.state.value,
            state_object: JSON.stringify(this.state)
        });

        this.id = model.id;

        await this.smHistoryRepository.add({
            state: this.state.value,
            state_object: JSON.stringify(this.state)
        }, this.id)
    };

    public getId() {
        if (!this.smInstance) {
            throw new Error('No state machine instance found');
        }

        return this.id;
    }

    public getStatus() {
        if (!this.smInstance) {
            throw new Error('No state machine instance found');
        }

        return this.state;
    }

    public async load(id: number) {
        this.sm = Machine(this.config);
        const data = await this.smRepository.get(id);

        if (data.filename !== __filename) {
            throw new Error('State machine does not belong to file');
        }

        this.state = State.create(JSON.parse(data.state_object));

        this.smInstance = this.sm.resolveState(this.state);
        this.id = id;
    };

    public async transition(event: string) {
        if (!this.smInstance) {
            throw new Error('No state machine instance found');
        }

        this.state = this.smInstance.transition(this.state, event);

        await this.store();
    };

    protected async store() {
        await this.smHistoryRepository.add({
            state: this.state.value,
            state_object: JSON.stringify(this.state)
        }, this.id);

        await this.smRepository.edit(this.id, {
            state: this.state.value,
            state_object: JSON.stringify(this.state)
        });
    };
}
