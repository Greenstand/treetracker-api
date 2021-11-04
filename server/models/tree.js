const { v4: uuid } = require('uuid');
const { Repository } = require('./Repository.js');
const log = require("loglevel");
const HttpError = require("../utils/HttpError");

const treeFromRequest = ({
    capture_id, 
    image_url,
    lat,
    lon,
    species_id = -1,
    morphology = '',
    age = -1,
    created_at,
    updated_at
}) => {
return Object.freeze({ 
    id: uuid(),
    latest_capture_id: capture_id,
    image_url,
    lat,
    lon,
    species_id,
    morphology,
    age,
    status: 'alive',
    created_at,
    updated_at
    });
}

const createTree = (treeRepository) => (async tree => {
    const repository = new Repository(treeRepository);
    return repository.add(tree);
});

/*
 * To find matched tree by providing capture id
 * Didn't use Repository because I think this business-specific SQL don't worth to put into Repository for future reuse.
 */
const potentialMatches = (treeRepository) => (async (captureId, distance = 6) => {
    log.warn("potentialMatches...");
  if(!captureId){
    throw new HttpError(400, "missing parameter captureId");
  }
    const id = captureId;
    const matches = await treeRepository.getPotentialMatches(id, distance);
  return matches;
});

module.exports = {
    createTree,
    treeFromRequest,
  potentialMatches,
};
