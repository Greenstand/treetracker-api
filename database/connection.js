const log = require('loglevel');
/* eslint-disable import/order */
const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];

log.debug(config.searchPath);
const knex = require('knex')(config);

module.exports = knex;
