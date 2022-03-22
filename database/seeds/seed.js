// functions to seed into database for testing
const log = require("loglevel");
const uuid = require('uuid');
const knex = require('../../server/infra/database/knex');
const captures = require("./data/20220210-Captures.json");

exports.createCapture = async function (date) {
  const result = await knex('capture')
    .insert({
      ...captures[0],
      created_at: date,
      device_configuration_id: uuid.v4(),
      session_id: uuid.v4(),
    }).returning('*');
  log.warn("Created capture: ", result);
}
