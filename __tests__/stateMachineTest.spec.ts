import 'mocha';
import {expect} from "chai";
import {database} from "../database/database";
import {processStateMachine} from "../application/domain/process/stateMachine/processStateMachine";
import {StateMachineHistoryRepository} from "../application/domain/process/repositories/stateMachineHistory";
import {StateMachineRepository} from '../application/domain/process/repositories/stateMachine';


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

        expect(sm.getStatus().value).to.be.equals('start');
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

        expect(sm2.getStatus().value).to.be.equals('start');
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

        expect(sm2.getStatus().value).to.be.equals('waiting');
    });

    it('should perform a state machine transition', async () => {
        let sm1 = new processStateMachine();
        await sm1.create({
            amount: 1000,
            type: 'prepay',
        });

        await sm1.transition('NEXT');

        expect(sm1.getStatus().value).to.be.equals('waiting');
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
});
