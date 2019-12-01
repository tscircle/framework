require('ts-node/register');

const dbConfig = require('./application/config/db');

module.exports = dbConfig.default;
