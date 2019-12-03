exports.default = {
    default: process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.IS_LOCAL ? 's3' : 'local',
    disks: {
        local: {
            driver: 'local',
            root: process.cwd() + '/storage',
        },
        s3: {
            driver: 's3',
            region: process.env.AWS_REGION,
            bucket: process.env.AWS_BUCKET,
        },
    },
};
