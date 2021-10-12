const expect = require('expect-runtime');

const connection = process.env.DATABASE_URL;
expect(connection).to.match(/^postgresql:\//);
const log = require('loglevel');

log.debug('db', connection);

const knexConfig = {
  client: 'pg',
  debug: process.env.NODE_LOG_LEVEL === 'debug',
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
