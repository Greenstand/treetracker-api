const BaseRepository = require('./BaseRepository');

class TreeRepository extends BaseRepository {
  constructor(session) {
    super('tree', session);
    this._tableName = 'tree';
    this._session = session;
  }

  async add(tree) {
    const wellKnownText = `POINT(${tree.lon} ${tree.lat})`;
    const result = await this._session.getDB().raw(
      `insert into treetracker.tree (
           id, lat, lon, location, latest_capture_id, image_url, species_id, age, morphology, 
           status, created_at, updated_at) 
           values(?, ?, ?, ST_PointFromText(?, 4326), ?, ?, ?, ?, ?, ?, ?, ?)
           returning id`,
      [
        tree.id,
        tree.lat,
        tree.lon,
        wellKnownText,
        tree.latest_capture_id,
        tree.image_url,
        tree.species_id,
        tree.age,
        tree.morphology,
        tree.status,
        tree.created_at,
        tree.updated_at,
      ],
    );
    return result.rows[0];
  }

  async getPotentialMatches(id, distance){
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
  t1.id IS NOT NULL
  AND	t2.id = :id 
	AND (t2.tree_id IS NULL OR t2.tree_id <> t1.id )
    `;
//      'SELECT t1.id, t1.image_url, t1.latest_capture_id, t1.lat, t1.lon, t1.species_id, t1.morphology, t1.age, t1.status, t1.created_at, t1.updated_at FROM treetracker.tree t1 LEFT JOIN treetracker.capture t2 ON ST_DWithin(t1.location, t2.location, :distance) WHERE t1.id= :id AND t2.id<> :id';
    const data = await this._session.getDB().raw(query, {id, distance});
    return data.rows;
  }
}

module.exports = TreeRepository;
