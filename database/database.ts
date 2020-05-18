import * as Knex from 'knex'
import { attachPaginate } from 'knex-paginate';

import getConfig from "../config/config";
const config = getConfig('db');

const database: any = Knex(config as Knex.Config);

if (!database.paginate) {
  attachPaginate();
}

export {
  database
};

