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
  updated_at,
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
    updated_at,
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
const potentialMatches = (session) => (async (captureId, distance = 6) => {
    log.warn("potentialMatches...");
  if(!captureId){
    throw new HttpError(400, "missing parameter captureId");
  }
    const id = captureId;
    // maximum distance in meters between possible matches and tree in query
    const query = `
SELECT
	t1.id,
	t1.image_url,
	t1.latest_capture_id,
	t1.lat,
	t1.lon,
	t1.species_id,
	t1.morphology,
	t1.age,
	t1.status,
	t1.created_at,
	t1.updated_at
FROM
	treetracker.capture t2
LEFT JOIN treetracker.tree t1 ON
	ST_DWithin(t1.location,
	t2.location,
	:distance) 
WHERE
	t2.id = :id 
	AND (t2.tree_id IS NULL OR t2.tree_id <> t1.id )
    `;
//      'SELECT t1.id, t1.image_url, t1.latest_capture_id, t1.lat, t1.lon, t1.species_id, t1.morphology, t1.age, t1.status, t1.created_at, t1.updated_at FROM treetracker.tree t1 LEFT JOIN treetracker.capture t2 ON ST_DWithin(t1.location, t2.location, :distance) WHERE t1.id= :id AND t2.id<> :id';
    const data = await session.getDB().raw(query, {id, distance});
    return data.rows;
});

module.exports = {
  createTree,
  treeFromRequest,
  potentialMatches,
};
