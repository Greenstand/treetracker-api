require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const path = require('path');
const expect = require('expect-runtime');

const connection = process.env.DATABASE_URL_SEEDER;

expect(connection).to.match(/^postgresql:\//);

module.exports = {
  development: {
    client: 'pg',
    connection,
    searchPath: [process.env.DATABASE_SCHEMA, 'public'],
    pool: {
      min: 1,
      max: 100,
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds'),
    },
    debug: process.env.NODE_LOG_LEVEL === 'debug',
  },
  test: {
    client: 'pg',
    connection,
    searchPath: [process.env.DATABASE_SCHEMA, 'public'],
    pool: {
      min: 1,
      max: 100,
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds'),
    },
    debug: process.env.NODE_LOG_LEVEL === 'debug',
  },
};
