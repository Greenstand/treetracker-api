const BaseRepository = require('./BaseRepository');

class TreeRepository extends BaseRepository {
  constructor(session) {
    super('tree', session);
    this._tableName = 'tree';
    this._session = session;
  }

  async add(tree) {
    await this._session.getDB().raw(
      `INSERT INTO tree (
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
        estimated_geometric_location,
        estimated_geographic_location
      )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ST_PointFromText(?, 4326), ?);`,
      [
        tree.id,
        tree.latest_capture_id,
        tree.image_url,
        tree.lat,
        tree.lon,
        tree.gps_accuracy,
        tree.morphology,
        tree.age,
        tree.status,
        tree.attributes,
        tree.species_id,
        tree.created_at,
        tree.updated_at,
        tree.point,
        tree.point,
      ],
    );
  }

  async getPotentialMatches(id, distance) {
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
        capture t2
      LEFT JOIN tree t1 ON
        ST_DWithin(t1.estimated_geographic_location,
        t2.estimated_geographic_location,
        :distance)
      WHERE
        t1.id IS NOT NULL
        AND	t2.id = :id
        AND (t2.tree_id IS NULL OR t2.tree_id <> t1.id )
    `;
    //      'SELECT t1.id, t1.image_url, t1.latest_capture_id, t1.lat, t1.lon, t1.species_id, t1.morphology, t1.age, t1.status, t1.created_at, t1.updated_at FROM tree t1 LEFT JOIN capture t2 ON ST_DWithin(t1.estimated_geometric_location, t2.estimated_geometric_location, :distance) WHERE t1.id= :id AND t2.id<> :id';
    const data = await this._session.getDB().raw(query, { id, distance });
    return data.rows;
  }
}

module.exports = TreeRepository;
