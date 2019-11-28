exports.default = {
    jobsPath: 'application/**/*.job.ts',
    default: process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.IS_LOCAL ? 'aws' : 'docker',
    docker: {
        region: "eu-central-1",
        endpoint: 'http://sqs:9324/queue/sqs'
    },
    aws: {
        region: process.env.AWS_REGION,
        endpoint: process.env.SQS
    }
};
