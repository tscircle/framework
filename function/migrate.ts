import {database} from "../database/database";

exports.handler = (event, context, callback) => {
    database.migrate.latest().then((res) => {
        console.log('migration successful: ', res);
        callback(null, 'success');
    }).catch((error) => {
        console.log('migration failed: ', error);
        callback('failed');
    });
};
