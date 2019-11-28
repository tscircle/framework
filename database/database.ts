import * as Knex from 'knex'

import getConfig from "../config/config";
const config = getConfig('db');

export const database = Knex(config as Knex.Config);

