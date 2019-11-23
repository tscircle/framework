import {expect} from 'chai';
import 'mocha';
import {EmailTypeController} from "../application/domain/email/controllers/emailTypeController";
import * as request from 'supertest';

describe('Controller Auth tests', () => {
    it('should return a 401 error', () => {
        const ctr = new EmailTypeController();
        const app = ctr.setupAPIHandler();

        request(app)
            .get("/emailType/")
            .send()
            .expect(401)
            .end((err, res) => {
                expect(res.text).to.eql('invalid token');
            });
    });

    it('should return a 200', () => {
        const ctr = new EmailTypeController();
        ctr.authProvider = undefined;
        const app = ctr.setupAPIHandler();

        request(app)
            .get("/emailType/")
            .send()
            .expect(200);
    });
});
