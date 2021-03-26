const expect = require('expect-runtime');
const log = require('loglevel');

let knexConfig = {
  client: 'pg',
  debug: process.env.NODE_LOG_LEVEL === 'debug' ? true : false,
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 100 },
  ssl: {
    rejectUnauthorized: false,
  },
};
log.debug(process.env.DATABASE_URL);

if (process.env.DATABASE_SCHEMA) {
  log.info('setting a schema');
  knexConfig.searchPath = [process.env.DATABASE_SCHEMA];
}
log.debug(knexConfig.searchPath);

const knex = require('knex')(knexConfig);

module.exports = knex;
