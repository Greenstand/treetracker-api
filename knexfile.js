const path = require('path');
const expect = require('expect-runtime');

const connection = process.env.DATABASE_URL;

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
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds'),
    },
  },

  test: {
    client: 'pg',
    connection,
    searchPath: [process.env.DATABASE_SCHEMA, 'public'],
    pool: {
      min: 1,
      max: 100,
    },
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds'),
    },
  },

  production: {
    client: 'pg',
    connection,
    searchPath: [process.env.DATABASE_SCHEMA, 'public'],
    pool: {
      min: 1,
      max: 100,
    },
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds'),
    },
  },
};
