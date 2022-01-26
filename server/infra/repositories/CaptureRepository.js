const BaseRepository = require('./BaseRepository');

class CaptureRepository extends BaseRepository {
  constructor(session) {
    super('capture', session);
    this._tableName = 'capture';
    this._session = session;
  }

  async getByFilter(filterCriteria, options) {
    console.log('PG REPOSITORY DB getByFilter', filterCriteria, options);
    // const query = Object.keys(filterCriteria).length
    //   ? filterCriteria
    //   : `id` > 10;

    return this._session
      .getDB()
      .where({ ...filterCriteria})
      .whereNot({status: 'deleted' })
      .select('*')
      .from('capture')
      .orderBy('created_at', 'desc')
      .limit(options.limit)
      .offset(options.offset);
  }

  async add(capture) {
    await this._session.getDB().raw(
      `INSERT INTO capture (
        id,
        reference_id,
        tree_id,
        image_url,
        lat,
        lon,
        gps_accuracy,
        grower_photo_url,
        grower_username,
        species_id,
        morphology,
        age,
        note,
        attributes,
        domain_specific_data,
        created_at,
        updated_at,
        device_configuration_id,
        session_id,
        status,
        grower_id,
        planting_organization_id,
        estimated_geometric_location,
        estimated_geographic_location
      )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ST_PointFromText(?, 4326), ?);`,
      [
        capture.id,
        capture.reference_id,
        capture.tree_id,
        capture.image_url,
        capture.lat,
        capture.lon,
        capture.gps_accuracy,
        capture.grower_photo_url,
        capture.grower_username,
        capture.species_id,
        capture.morphology,
        capture.age,
        capture.note,
        capture.attributes,
        capture.domain_specific_data,
        capture.created_at,
        capture.updated_at,
        capture.device_configuration_id,
        capture.session_id,
        capture.status,
        capture.grower_id,
        capture.planting_organization_id,
        capture.point,
        capture.point,
      ],
    );
  }

  async getById(id) {
    const object = await this._session
      .getDB()
      .select()
      .table(this._tableName)
      .where({ id, status: 'active' })
      .first();
    return object;
  }
}

module.exports = CaptureRepository;
