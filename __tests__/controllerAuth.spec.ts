import {expect} from 'chai';
import 'mocha';
import {EmailTypeController} from "../application/domain/email/controllers/emailTypeController";

const request = require("supertest");

describe('Controller Auth tests', () => {
    it('should return an 401 error', () => {
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
});
