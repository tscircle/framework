import {expect} from 'chai';
import 'mocha';
import {database} from "../database/database";
import {EmailTypeRepository} from "../application/domain/email/repositories/emailTypeRepository";
import {EmailController} from "../application/domain/email/controllers/emailController";
import {event} from '../__mocks__/event';
import * as LambdaTester from "lambda-tester";
import {APIGatewayEvent} from "aws-lambda";


describe('Crud Controller Tests', () => {
    let parentId: string;
    let entryId: string;

    before(async () => {
        const repository = new EmailTypeRepository();
        await database.migrate.latest();
        const data = await repository.add({name: 'test'});
        parentId = <string> data.id;
    });

    it('should respond a validation error response', async () => {
        const handler = new EmailController().setupRestHandler();
        const extEvent = <APIGatewayEvent> {
            ...event,
            pathParameters: {
                parentId
            },
            httpMethod: 'POST',
            resource: `/emailType/${parentId}/email`
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                expect(result.statusCode).to.eql(422);
                const data = JSON.parse(result.body);
                expect(data[0].message).to.eql('"name" is required');
            });
    });

    it('should respond a response code of 201', async () => {
        const handler = new EmailController().setupRestHandler();
        const extEvent = <APIGatewayEvent> {
            ...event,
            pathParameters: {
                parentId
            },
            body: JSON.stringify({
                name: 'mocha'
            }),
            httpMethod: 'POST',
            resource: `/emailType/${parentId}/email`
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                expect(result.statusCode).to.eql(201);
                const data = JSON.parse(result.body);
                entryId = data.id;
            });
    });

    it('should contains the created entry', async () => {
        const handler = new EmailController().setupRestHandler();
        const extEvent = <APIGatewayEvent> {
            ...event,
            pathParameters: {
                entryId
            },
            httpMethod: 'GET',
            resource: `/emailType/${parentId}/email`
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                expect(result.statusCode).to.eql(200);
                const data = JSON.parse(result.body);
                const count = data.filter((item) => {
                    return item.name === 'mocha' &&
                        item.id === entryId;
                }).length;
                expect(count).to.equals(1);
            });
    });

    it('should update the created entry', async () => {
        const handler = new EmailController().setupRestHandler();
        const extEvent = <APIGatewayEvent> {
            ...event,
            pathParameters: {
                parentId,
                id: entryId
            },
            body: JSON.stringify({
                name: 'm0cha'
            }),
            httpMethod: 'PUT',
            resource: `/emailType/${parentId}/email/${entryId}`
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                expect(result.statusCode).to.eql(202);
            });
    });

    it('should show the updated entry', async () => {
        const handler = new EmailController().setupRestHandler();
        const extEvent = <APIGatewayEvent> {
            ...event,
            pathParameters: {
                parentId,
                id: entryId
            },
            httpMethod: 'GET',
            resource: `/emailType/${parentId}/email/${entryId}`
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                const data = JSON.parse(result.body);
                expect(result.statusCode).to.eql(200);
                expect(data).to.property('name', 'm0cha');
                expect(data).to.property('id', entryId);
            });
    });

    it('should delete the updated entry', async () => {
        const handler = new EmailController().setupRestHandler();
        const extEvent = <APIGatewayEvent> {
            ...event,
            pathParameters: {
                parentId,
                id: entryId
            },
            httpMethod: 'DELETE',
            resource: `/emailType/${parentId}/email/${entryId}`
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                expect(result.statusCode).to.eql(204);
            });
    });

    it('should not contains the updated entry anymore', async () => {
        const handler = new EmailController().setupRestHandler();
        const extEvent = <APIGatewayEvent> {
            ...event,
            pathParameters: {
                parentId,
            },
            httpMethod: 'GET',
            resource: `/emailType/${parentId}/email`
        }

        await LambdaTester(handler)
            .event(extEvent)
            .expectResult(result => {
                expect(result.statusCode).to.eql(200);
                const data = JSON.parse(result.body);
                expect(data).to.not.deep.include([{id: entryId}]);
            });
    });
});
