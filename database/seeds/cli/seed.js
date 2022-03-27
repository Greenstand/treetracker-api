// functions to seed into database for testing
const log = require('loglevel');
const uuid = require('uuid');
const knex = require('../../../server/database/knex');
const captures = require('../data/20220210-Captures.json');

exports.createCapture = async function (
  created_at,
  planting_organization_id,
  lat,
  lon,
  grower_account_id,
) {
  const result = await knex('capture')
    .insert({
      ...captures[0],
      created_at,
      captured_at: created_at,
      device_configuration_id: uuid.v4(),
      session_id: uuid.v4(),
      planting_organization_id,
      lat,
      lon,
      estimated_geometric_location: knex.raw(
        `ST_SetSRID(ST_MakePoint(${lon},${lat}),4326)`,
      ),
      estimated_geographic_location: knex.raw(
        `ST_SetSRID(ST_MakePoint(${lon},${lat}),4326)`,
      ),
      grower_account_id,
    })
    .returning('*');
  log.warn('Created capture: ', result);
};

exports.createTree = async function (capture_id) {
  const capturesDB = await knex('capture')
    .select('*')
    .where({ id: capture_id });
  if (capturesDB.length === 0) {
    throw new Error('Capture not found');
  }

  const [capture] = capturesDB;

  const treeDB = await knex('tree')
    .insert({
      latest_capture_id: capture.id,
      image_url: capture.image_url,
      lat: capture.lat,
      lon: capture.lon,
      estimated_geometric_location: capture.estimated_geometric_location,
      gps_accuracy: capture.gps_accuracy,
      morphology: capture.morphology,
      age: capture.age,
      created_at: new Date(),
      updated_at: new Date(),
      estimated_geographic_location: capture.estimated_geographic_location,
    })
    .returning('*');
  log.warn('Created tree: ', treeDB);
  const captureUpdate = await knex('capture')
    .update({
      tree_id: treeDB[0].id,
    })
    .where({ id: capture.id });
  log.warn('Updated capture: ', captureUpdate);
};
