import {expect} from 'chai';
import 'mocha';
import {EmailType, EmailTypeInterface} from "../application/domain/email/models/emailTypeModel";
import {database} from '../database/database';

describe('Model tests', () => {
    before(async () => {
        await database.migrate.latest();
    });

    beforeEach(async () => {
        //await database(EmailType.tableName).truncate();
    });

    it('should create a new model', () => {
        return EmailType.q().insert(<EmailTypeInterface>{name: 'Name1'})
            .catch((error) => {
                console.log(error);
            });
    });

    it('should get the first entry', () => {
        return EmailType.q().orderBy([{column: 'id', order: 'desc'}]).first().then((data: EmailTypeInterface) => {
            expect(data.name).to.eql('Name1');
        });
    });

    it('should update an item', () => {
        return EmailType.updateOrCreate({name: 'Name1'}, {name: 'Name2'})
            .then(() => {
                return EmailType.q().where({name: 'Name2'}).first()
                    .then((data: EmailTypeInterface) => {
                        expect(data.name).to.eql('Name2');
                    });
            });
    });

    it('should create an item', () => {
        return EmailType.updateOrCreate({name: 'Name3'}, {name: 'Name3'})
            .then(() => {
                return EmailType.q().where({name: 'Name3'}).first()
                    .then((data: EmailTypeInterface) => {
                        expect(data.name).to.eql('Name3');
                    });
            });
    });
});
