import * as Knex from 'knex'

import config from '../tscircle/config/db';

export const database = Knex(config as Knex.Config);

