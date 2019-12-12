import {MachineConfig, Machine, State} from 'xstate';
import {BaseRepository} from "../repository/baseRepository";

export default abstract class stateMachine {
    protected abstract smRepository: BaseRepository;
    protected abstract smHistoryRepository: BaseRepository;
    protected abstract config: MachineConfig<any, any, any>;
    protected id: number;
    protected sm;
    protected smInstance;


    public async create(context: Object): Promise<number> {
        this.sm = Machine(this.config);
        this.smInstance = this.sm.withContext(context);
        const model = await this.smRepository.add({
            state: JSON.stringify(this.smInstance),
            filename: __filename
        });
        this.id = model.id;

        return this.id;
    };

    public async getStatus() {
        if (!this.smInstance) {
            throw new Error('No state machine instance found');
        }

        return this.smInstance.status;
    }

    public async load(id: number) {
        const data = await this.smRepository.get(this.id);

        if (data.filename !== __filename) {
            throw new Error('State machine does not belong to file');
        }

        const previousState = State.create(data.currentState);

        this.smInstance = this.sm.resolveState(previousState);
        this.id = id;
    };

    public async send(event: string, options?: Object) {
        if (!this.smInstance) {
            throw new Error('No state machine instance found');
        }

        this.sm.smInstance.send(event, options);

        await this.store();
    };

    protected async store() {
        await this.smRepository.edit(this.id, {state: JSON.stringify(this.smInstance)});
        await this.smHistoryRepository.add({
            state: JSON.stringify(this.smInstance)
        }, this.id);
        console.log(this.smInstance);
    };
}
