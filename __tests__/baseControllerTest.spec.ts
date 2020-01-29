import {expect} from 'chai';
import 'mocha';
import {EmailSpecialController} from "../application/domain/email/controllers/emailSpecialController";
import {EmailSpecialPostController} from "../application/domain/email/controllers/emailSpecialPostController";
import * as LambdaTester from "lambda-tester";
import {event} from './mocks';
import {APIGatewayEvent} from "aws-lambda";

describe('Base Controller Tests', () => {
    it('should handle http errors', async () => {
        const handler = new EmailSpecialController().setupRestHandler();
        const extEvent = <APIGatewayEvent> {
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

    it('should respond 200 from custom routes', async () => {
        const handler = new EmailSpecialController().setupRestHandler();
        const extEvent = <APIGatewayEvent> {
            ...event,
            pathParameters: {
                teamId: '99',
            },
            httpMethod: 'GET',
            resource: '/email/teams/{teamId}'
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                expect(result.statusCode).to.eql(200);
            });
    });

    it('should respond a parsed file multipart/form-data', async () => {
        const handler = new EmailSpecialController().setupRestHandler();
        const extEvent = <APIGatewayEvent> {
            ...event,
            headers: {
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryppsQEwf2BVJeCe0M'
            },
            body: 'LS0tLS0tV2ViS2l0Rm9ybUJvdW5kYXJ5cHBzUUV3ZjJCVkplQ2UwTQ0KQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPSJmb28iDQoNCmJhcg0KLS0tLS0tV2ViS2l0Rm9ybUJvdW5kYXJ5cHBzUUV3ZjJCVkplQ2UwTS0t',
            isBase64Encoded: true,
            httpMethod: 'POST',
            resource: '/email/upload'
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                const data = JSON.parse(result.body);
                expect(data).to.deep.equal({ foo: 'bar' })
            });
    });

    it('should respond a validation error message', async () => {
        const handler = new EmailSpecialPostController().setupRestHandler();
        const extEvent = <APIGatewayEvent> {
            ...event,
            httpMethod: 'POST',
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

