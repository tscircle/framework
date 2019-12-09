import {expect} from 'chai';
import 'mocha';
import * as request from 'supertest';
import {database} from "../database/database";
import {EmailTypeRepository} from "../application/domain/email/repositories/emailTypeRepository";
import {EmailController} from "../application/domain/email/controllers/emailController";

chai.use(require('chai-things'));

describe('Crud Controller Tests', () => {
    let parenId;
    let entryId = 99;

    before(async () => {
        const repository = new EmailTypeRepository();
        await database.migrate.latest();
        const data = await repository.add({name: 'test'});
        parenId = data.id;
    });

    it('should respond a validation error response', async () => {
        const ctr = new EmailController();
        const app = ctr.setupAPIHandler();

        const response = await request(app)
            .post('/emailType/' + parenId + '/email')
            .expect(422);

        const data = JSON.parse(response.text);
        expect(data[0].message).to.eql('"name" is required');
    });

    it('should respond a response code of 200', async () => {
        const ctr = new EmailController();
        const app = ctr.setupAPIHandler();

        const response = await request(app)
            .post('/emailType/' + parenId + '/email')
            .send({
                name: 'mocha'
            })
            .expect(201);

        const data = JSON.parse(response.text);
        entryId = data.id;
    });

    it('should contains the created entry', async () => {
        const ctr = new EmailController();
        const app = ctr.setupAPIHandler();

        const response = await request(app)
            .get('/emailType/' + parenId + '/email')
            .expect(200);

        const data = JSON.parse(response.text);

        expect(data).to.include.something.that.property('name', 'mocha');
        expect(data).to.include.something.that.property('id', entryId);
    });

    it('should update the created entry', async () => {
        const ctr = new EmailController();
        const app = ctr.setupAPIHandler();

        await request(app)
            .put('/emailType/' + parenId + '/email/' + entryId)
            .send({
                name: 'm0cha'
            })
            .expect(202)
    });

    it('should show the updated entry', async () => {
        const ctr = new EmailController();
        const app = ctr.setupAPIHandler();

        const response = await request(app)
            .get('/emailType/' + parenId + '/email/' + entryId)
            .expect(200);

        const data = JSON.parse(response.text);
        expect(data).to.property('name', 'm0cha');
        expect(data).to.property('id', entryId);

    });

    it('should delete the updated entry', async () => {
        const ctr = new EmailController();
        const app = ctr.setupAPIHandler();

        await request(app)
            .delete('/emailType/' + parenId + '/email/' + entryId)
            .expect(204)
    });

    it('should not contains the updated entry anymore', async () => {
        const ctr = new EmailController();
        const app = ctr.setupAPIHandler();

        const response = await request(app)
            .get('/emailType/' + parenId + '/email')
            .expect(200);

        const data = JSON.parse(response.text);
        expect(data).to.not.deep.include([{id: entryId}]);
    });
});
