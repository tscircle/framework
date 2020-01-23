import {expect} from 'chai';
import 'mocha';
import * as request from 'supertest';
import {EmailSpecialController} from "../application/domain/email/controllers/emailSpecialController";
import {EmailSpecialPostController} from "../application/domain/email/controllers/emailSpecialPostController";


describe('Base Controller Tests', () => {
    it('should respond a predefined response', async () => {
        const ctr = new EmailSpecialController();
        const app = ctr.setupRestHandler();

        const response = await request(app)
            .get("/email/1/special")
            .expect(200);

        const data = JSON.parse(response.text);
        expect(data.hello).to.eql("from EmailSpecialController");

    });

    it('should respond a validation error message', async () => {
        const ctr = new EmailSpecialPostController();
        const app = ctr.setupRestHandler();

        const response = await request(app)
            .post("/email/1/special")
            .expect(422);

        const data = JSON.parse(response.text);
        expect(data[0].message).to.eql('"data" is required');
    });

    it('should respond a successful response', async () => {
        const ctr = new EmailSpecialPostController();
        const app = ctr.setupRestHandler();

        const response = await request(app)
            .post("/email/1/special")
            .send({
                data: 'hello',
                html: '<html>'
            })
            .expect(200);
    });
});

