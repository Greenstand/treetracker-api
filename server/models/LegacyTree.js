/**
 * This is a temporary model that allows to replicate data from field data schema to the
 * treetracker database for backward compatability while the breakdown/migration of monolith
 * db is in process. It can be removed at appropriate time when the dependencies on
 * legacy tables in treetracker main db is bound to its relevant contexts. For e.g, tree_attributes
 * is really capture_metadata and has to be owned by a future capture service context and the current
 * trees table in treetracker db is really a tree capture table and do not represent a unique tree..
 */
const { Repository } = require('./Repository');
const { v4: uuidv4 } = require('uuid');

const LegacyTree = ({
  uuid,
  image_url,
  lat,
  lon,
  planter_id,
  planter_identifier,
  planter_photo_url,
  device_identifier = null,
  note = '',
  timestamp,
}) =>
  Object.freeze({
    uuid: uuid || uuidv4(),
    image_url: image_url || '',
    lat,
    lon,
    planter_id,
    planter_identifier: planter_identifier || '',
    planter_photo_url: planter_photo_url || '',
    device_identifier,
    note: note || '',
    time_created: new Date(timestamp).toISOString(),
    time_updated: new Date(timestamp).toISOString(),
  });

const createTreesInMainDB = (
  legacyTreeRepoImpl,
  legacyTreeAttrRepoImpl,
) => async (tree, attributes) => {
  const legacyTreeRepository = new Repository(legacyTreeRepoImpl);
  const legacyAttributesRepository = new Repository(legacyTreeAttrRepoImpl);
  const result = await legacyTreeRepository.add(tree);
  const tree_attributes = attributes.map((attribute) =>
    Object.assign({ tree_id: result.id }, attribute),
  );
  console.log('LEGACY TREE MODEL createTreesInMainDB', result, tree_attributes);
  await legacyAttributesRepository.add(tree_attributes);
  return { entity: result, raisedEvents: [] };
};

module.exports = { createTreesInMainDB, LegacyTree };
