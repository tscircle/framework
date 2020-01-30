import {APIGatewayEvent, APIGatewayEventRequestContext} from "aws-lambda";

export const event: APIGatewayEvent = {
    pathParameters: null,
    body: JSON.stringify({}),
    headers: {
        'Content-Type': 'application/json'
    },
    multiValueHeaders: {},
    isBase64Encoded: false,
    httpMethod: 'GET',
    path: '',
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    resource: '',
    requestContext: <APIGatewayEventRequestContext> {}
}