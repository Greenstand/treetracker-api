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
}

module.exports = TreeRepository;
