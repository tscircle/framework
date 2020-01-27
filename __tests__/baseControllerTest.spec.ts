import {expect} from 'chai';
import 'mocha';
import {EmailSpecialController} from "../application/domain/email/controllers/emailSpecialController";
import {EmailSpecialPostController} from "../application/domain/email/controllers/emailSpecialPostController";
import * as LambdaTester from "lambda-tester";
import {event} from './mocks';

describe('Base Controller Tests', () => {
    it('should handle http errors', async () => {
        const handler = new EmailSpecialController().setupRestHandler();
        const extEvent = {
            ...event,
            pathParameters: {
                id: '1',
            },
            httpMethod: 'PATCH',
            resource: 'emailEspecial'
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                expect(result.statusCode).to.eql(405);
                expect(result.body).to.eql("Method Not Allowed");
            });
    });

    it('should respond a validation error message', async () => {
        const handler = new EmailSpecialPostController().setupRestHandler();
        const extEvent = {
            ...event,
            httpMethod: 'POST',
            body: {
            },
            resource: '/email/1/special'
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                const data = JSON.parse(result.body);
                expect(result.statusCode).to.eql(422);
                expect(data[0].message).to.eql('"name" is required');
            });
    });
});

