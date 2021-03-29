const BaseRepository = require('./BaseRepository');

class LegacyTreeRepository extends BaseRepository {
  constructor(session) {
    super('tree', session);
    this._tableName = 'trees';
    this._session = session;
  }

  async add(tree) {
    // Since the query uses postgres function ST_PointFromText, knex raw function is used
    const geometry = 'POINT( ' + tree.lon + ' ' + tree.lat + ')';
    console.log('PG MIGRATION REPOSITORIES add', tree);
    const result = await this._session
      .getDB()
      .raw(
        `insert into tree (planter_id, lat, lon, estimated_geometric_location, time_created, time_updated, image_url, planter_photo_url, planter_identifier, device_identifier, note, uuid) values(?, ?, ?, ST_PointFromText(?, 4326), ?, ?, ?, ?, ?, ?, ?, ?) returning id`,
        [
          tree.planter_id,
          tree.lat,
          tree.lon,
          geometry,
          tree.time_created,
          tree.time_updated,
          tree.image_url,
          tree.planter_photo_url,
          tree.planter_identifier,
          tree.device_identifier,
          tree.note,
          tree.uuid,
        ],
      );
    console.log('PG MIGRATION REPOSITORIES add', tree, result);
    return await result.rows[0];
  }
}

class LegacyTreeAttributeRepository extends BaseRepository {
  constructor(session) {
    super('tree_attributes', session);
    this._tableName = 'tree_attributes';
    this._session = session;
  }

  async add(tree_attributes) {
    console.log(
      'PG MIGRATION REPOSITORIES legacy tree attr repo',
      tree_attributes,
    );
    await tree_attributes.forEach((attribute) => {
      super.create(attribute);
    });
  }
}

module.exports = { LegacyTreeAttributeRepository, LegacyTreeRepository };
