/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const { v4: uuid } = require('uuid');
const log = require('loglevel');
const { Repository } = require('./Repository.js');
const HttpError = require('../utils/HttpError');
const { PaginationQueryOptions } = require('./helper');

const treeFromRequest = ({
  capture_id,
  image_url,
  lat,
  lon,
  location,
  gps_accuracy,
  species_id = -1,
  morphology = '',
  age = -1,
  status,
  estimated_geographic_location,
  created_at,
  updated_at,
}) => {
  return Object.freeze({
    id: uuid(),
    latest_capture_id: capture_id,
    image_url,
    lat,
    lon,
    location,
    gps_accuracy,
    species_id,
    morphology,
    age,
    status: status || 'alive',
    estimated_geographic_location,
    created_at,
    updated_at,
  });
};

const Tree = ({
  id,
  latest_capture_id,
  image_url,
  lat,
  lon,
  location,
  gps_accuracy,
  species_id,
  morphology,
  age,
  status,
  created_at,
  updated_at,
  estimated_geographic_location,
}) => {
  return Object.freeze({
    id,
    latest_capture_id,
    image_url,
    lat,
    lon,
    location,
    gps_accuracy,
    species_id,
    morphology,
    age,
    status,
    created_at,
    updated_at,
    estimated_geographic_location,
  });
};

const FilterCriteria = ({
  status = undefined,
  field_username = undefined,
  field_user_id = undefined,
}) => {
  return Object.entries({ status, field_username, field_user_id })
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
  const trees = await treeRepository.getByFilter(filter, options);
  return trees.map((row) => {
    return Tree({ ...row });
  });
};

const createTree = (treeRepository) => async (tree) => {
  const repository = new Repository(treeRepository);
  return repository.add(tree);
};

/*
 * To find matched tree by providing capture id
 * Didn't use Repository because I think this business-specific SQL don't worth to put into Repository for future reuse.
 */
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
  treeFromRequest,
  potentialMatches,
};
