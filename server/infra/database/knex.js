const expect = require('expect-runtime');
const connection = process.env.DATABASE_URL
const log = require('loglevel');
log.debug('db', connection);

let knexConfig = {
  client: 'pg',
  debug: process.env.NODE_LOG_LEVEL === 'debug' ? true : false,
  connection,
  pool: { min: 0, max: 10 },
};

log.debug(process.env.DATABASE_SCHEMA);
if (process.env.DATABASE_SCHEMA) {
  log.info('setting a schema');
  knexConfig.searchPath = [process.env.DATABASE_SCHEMA, 'public'];
}
log.debug(knexConfig.searchPath);

const knex = require('knex')(knexConfig);

module.exports = { knex };
