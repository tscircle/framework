import {expect} from 'chai';
import 'mocha';
import {EmailType, EmailTypeInterface} from "../application/domain/email/models/emailTypeModel";
import {database} from '../database/database';
import {EmailRepository} from "../application/domain/email/repositories/emailRepository";

describe('Repository tests', () => {
    before(async () => {
        await database.migrate.latest();
    });

    it('should create a new entry and overtake columns from the parent model', async () => {
        const emailTypeEntry = await EmailType.create(<EmailTypeInterface>{name: 'Name1', team_id: 99});

        const email = new EmailRepository();
        const emailEntry = await email.add({name: 'Name2'}, emailTypeEntry.id);

        expect(emailEntry.team_id).to.eql(emailTypeEntry.team_id);
    });
});
