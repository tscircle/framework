import 'mocha';
import {expect} from "chai";
import {database} from "../database/database";
import {processStateMachine} from "../application/domain/process/stateMachine/processStateMachine";


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

        console.log(sm.getStatus());
    });

    it('it should store the state machine instance into the db', () => {

    });
});
