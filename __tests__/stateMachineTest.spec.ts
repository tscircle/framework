import 'mocha';
import {expect} from "chai";
import {database} from "../database/database";
import {processStateMachine} from "../application/domain/process/stateMachine/processStateMachine";
import {StateMachineHistoryRepository} from "../stageMachine/repositories/stateMachineHistoryRepository";
import {StateMachineRepository} from "../stageMachine/repositories/stateMachineRepository";
import {processStateMachine2} from "../application/domain/process/stateMachine/processStateMachine2";


describe('State Machine tests', () => {
    before(async () => {
        await database.migrate.latest();
    });

    it('should create a new state machine instance', async () => {
        let sm = new processStateMachine();
        await sm.create({
            amount: 1000,
            type: 'prepay',
        });

        expect(sm.getStatus()).to.be.equals('start');
    });

    it('should see state machine state in history db table', async () => {
        let sm = new processStateMachine();
        await sm.create({
            amount: 1000,
            type: 'prepay',
        });

        const repo = new StateMachineHistoryRepository();
        const historyEntry = await repo.model.q().where('state_machine_id', sm.getId()).first();
        expect(JSON.parse(historyEntry.state_object).value).to.be.equals('start');
        expect(historyEntry.state).to.be.equals('start');
    });

    it('should see state machine state in history db table is marked as done', async () => {
        let sm1 = new processStateMachine();
        await sm1.create({
            amount: 1000,
            type: 'prepay',
        });

        await sm1.transition('NEXT');
        await sm1.transition('NEXT');
        await sm1.transition('NEXT');

        const repo = new StateMachineRepository();
        const historyEntry = await repo.model.q().where('id', sm1.getId()).first();
        expect(historyEntry.done).to.be.equals(1);
    });

    it('should reload the state machine instance from the db', async () => {
        let sm1 = new processStateMachine();
        await sm1.create({
            amount: 1000,
            type: 'prepay',
        });

        let sm2 = new processStateMachine();
        await sm2.load(sm1.getId());

        expect(sm2.getStatus()).to.be.equals('start');
    });

    it('should perform a transition and reload the state machine instance from the db', async () => {
        let sm1 = new processStateMachine();
        await sm1.create({
            amount: 1000,
            type: 'prepay',
        });

        await sm1.transition('NEXT');

        let sm2 = new processStateMachine();
        await sm2.load(sm1.getId());

        expect(sm2.getStatus()).to.be.equals('waiting');
    });

    it('should perform a state machine transition', async () => {
        let sm1 = new processStateMachine();
        await sm1.create({
            amount: 1000,
            type: 'prepay',
        });

        await sm1.transition('NEXT');

        expect(sm1.getStatus()).to.be.equals('waiting');
    });

    it('should see the state machine transition in state machine table', async () => {
        let sm1 = new processStateMachine();
        await sm1.create({
            amount: 1000,
            type: 'prepay',
        });

        await sm1.transition('NEXT');

        const repo = new StateMachineRepository();
        const historyEntry = await repo.model.q().where('id', sm1.getId()).first();
        expect(JSON.parse(historyEntry.state_object).value).to.be.equals('waiting');
        expect(historyEntry.state).to.be.equals('waiting');
        expect(historyEntry.done).to.be.equals(0);
    });

    it('should see the state machine transition in state machine history table', async () => {
        let sm1 = new processStateMachine();
        await sm1.create({
            amount: 1000,
            type: 'prepay',
        });

        await sm1.transition('NEXT');

        const repo = new StateMachineHistoryRepository();
        const historyEntry = await repo.model.q().where('state_machine_id', sm1.getId());

        expect(historyEntry.length).to.be.equals(2);

        expect(
            historyEntry.filter((entry) => {
                return entry.state === 'start'
            }).length
        ).to.be.equals(1);

        expect(
            historyEntry.filter((entry) => {
                return entry.state === 'waiting'
            }).length
        ).to.be.equals(1);
    });

    it('should throw an error if transition is called on a non created/loaded state machine', async () => {
        let sm = new processStateMachine();
        let error;

        try {
            await sm.transition('NEXT');
        } catch (e) {
            error = e.message;
        }

        expect(error).to.be.equals('No state machine instance found');
    });

    it('should throw an error if getId is called on a non created/loaded state machine', async () => {
        let sm = new processStateMachine();
        let error;

        try {
            await sm.getId();
        } catch (e) {
            error = e.message;
        }

        expect(error).to.be.equals('No state machine instance found');
    });

    it('should throw an error if getStatus is called on a non created/loaded state machine', async () => {
        let sm = new processStateMachine();
        let error;

        try {
            await sm.getStatus();
        } catch (e) {
            error = e.message;
        }

        expect(error).to.be.equals('No state machine instance found');
    });

    it('should throw an error if a state machine id is loaded into a wrong state machine', async () => {
        let sm1 = new processStateMachine();
        let sm2 = new processStateMachine2();

        await sm1.create({
            amount: 1000,
            type: 'prepay',
        });

        let error;

        try {
            await sm2.load(sm1.getId());
        } catch (e) {
            error = e.message;
        }

        expect(error).to.be.equals('State machine does not belong to class');
    });
});
