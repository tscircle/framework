export default {
    default: process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.IS_LOCAL ? 'aws' : 'docker',
    docker: {
        region: "eu-central-1",
        endpoint: "http://dynamodb:8000",
        tableName: "cache"
    },
    aws: {
        region: process.env.AWS_REGION,
        tableName: process.env.DYNAMODB_CACHE_TABLE
    }
};
