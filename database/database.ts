import * as Knex from 'knex'

import config from '../application/config/db';

export const database = Knex(config as Knex.Config);

