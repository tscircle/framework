import * as path from 'path';

const config = {
    client: 'mysql',
    connectionType: process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.IS_LOCAL ? 'aws' : 'docker',
    debug: false,
    connection: {},
    connections: {
        docker: {
            host: 'mysql',
            user: 'homestead',
            password: 'secret',
            database: 'forge'
        },
        aws: {
            host: process.env.DB_HOST,
            user: 'forge',
            password: process.env.DB_PASSWORD,
            database: 'forge'
        }
    },
    seeds: {
        directory: '/var/task/application/database/seeds'
    },
    migrations: {
        tableName: 'migrations',
        directory: '/var/task/application/database/migrations'
    },
    timezone: 'UTC'
};

config.connection = config.connections[config.connectionType];

export default config;

