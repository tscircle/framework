import {APIGatewayEvent} from "aws-lambda";

export const event: APIGatewayEvent = {
    pathParameters: null,
    body: JSON.stringify({}),
    headers: null,
    multiValueHeaders: null,
    isBase64Encoded: null,
    httpMethod: 'GET',
    path: '',
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    resource: '',
    requestContext: null
}