/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const log = require('loglevel');
const { Repository } = require('./Repository');
const HttpError = require('../utils/HttpError');
const { PaginationQueryOptions } = require('./helper');
const { raiseEvent, DomainEvent } = require('./DomainEvent');

const treeInsertObject = ({
  id,
  latest_capture_id,
  image_url,
  lat,
  lon,
  gps_accuracy,
  species_id = null,
  morphology = null,
  age = null,
  attributes,
}) => {
  return Object.freeze({
    id,
    latest_capture_id,
    image_url,
    lat,
    lon,
    gps_accuracy,
    morphology,
    age,
    status: 'active',
    attributes: attributes ? { entries: attributes } : null,
    species_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    point: `POINT( ${lon} ${lat} )`,
  });
};

const Tree = ({
  id,
  latest_capture_id,
  image_url,
  lat,
  lon,
  gps_accuracy,
  morphology,
  age,
  status,
  attributes,
  species_id,
  created_at,
  updated_at,
}) => {
  return Object.freeze({
    id,
    latest_capture_id,
    image_url,
    lat,
    lon,
    gps_accuracy,
    morphology,
    age,
    status,
    attributes,
    species_id,
    created_at,
    updated_at,
  });
};

const FilterCriteria = ({
  grower_username = undefined,
  grower_id = undefined,
  id = undefined,
}) => {
  return Object.entries({ grower_username, grower_id, id })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};
const getTrees = (treeRepositoryImpl) => async (filterCriteria = undefined) => {
  let filter = {};
  let options = { limit: 1000, offset: 0 };
  if (filterCriteria !== undefined) {
    filter = FilterCriteria({ ...filterCriteria });
    options = { ...options, ...PaginationQueryOptions({ ...filterCriteria }) };
  }
  // console.log('TREE MODEL getTrees', filterCriteria, filter, options);
  const treeRepository = new Repository(treeRepositoryImpl);
  const trees = await treeRepository.getByFilter(
    { ...filter, status: 'active' },
    options,
  );
  return trees.map((row) => {
    return Tree({ ...row });
  });
};

const createTree = (treeRepository, eventRepository) => async (tree) => {
  const repository = new Repository(treeRepository);
  await repository.add(tree);

  const raiseCaptureEvent = raiseEvent(eventRepository);
  const domainEvent = await raiseCaptureEvent(DomainEvent(tree));
  return { raisedEvents: { domainEvent } };
};

const potentialMatches = (treeRepository) => async (
  captureId,
  distance = 6,
) => {
  log.warn('potentialMatches...');
  if (!captureId) {
    throw new HttpError(400, 'missing parameter captureId');
  }
  const id = captureId;
  const matches = await treeRepository.getPotentialMatches(id, distance);
  return matches;
};

module.exports = {
  getTrees,
  createTree,
  treeInsertObject,
  potentialMatches,
  Tree,
};
