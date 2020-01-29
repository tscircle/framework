import {expect} from 'chai';
import 'mocha';
import {EmailTypeController} from "../application/domain/email/controllers/emailTypeController";
import * as LambdaTester from "lambda-tester";
import {event} from './mocks';
import {APIGatewayEvent} from "aws-lambda";

describe('Controller Auth tests', () => {
    it('should return a 401 error', async () => {
        const handler = new EmailTypeController().setupRestHandler();
        const extEvent = <APIGatewayEvent> {
            ...event,
            headers: {},
            pathParameters: null,
            httpMethod: 'GET',
            resource: 'emailType'
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                expect(result.body).to.eql('invalid token');
            });
    });

    it('should return a 200', async () => {
        const ctrl = new EmailTypeController();
        ctrl.authProvider = null;
        const handler = ctrl.setupRestHandler();

        const extEvent = <APIGatewayEvent> {
            ...event,
            headers: {},
            pathParameters: null,
            httpMethod: 'GET',
            resource: 'emailType'
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                expect(result.statusCode).to.eql(200);
            });
    });
});
