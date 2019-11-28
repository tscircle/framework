require('ts-node/register');

const dbConfig = require('./db');

module.exports = dbConfig.default;
