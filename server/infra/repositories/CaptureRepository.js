const BaseRepository = require('./BaseRepository');

class CaptureRepository extends BaseRepository {
  constructor(session) {
    super('capture', session);
    this._tableName = 'capture';
    this._session = session;
  }

  async getByFilter(filterCriteria, options) {
    const where = this._session
      .getDB()
      .whereNot({status: 'deleted' });

    // TODO: this logic should be moved to the model
    // see https://github.com/Greenstand/treetracker-api/issues/50
    if (typeof (filterCriteria?.tree_associated) !== "undefined") {
      if (filterCriteria.tree_associated === "true") {
        where.whereNotNull('tree_id');
      } else if (filterCriteria.tree_associated === "false") {
        where.whereNull('tree_id');
      }
      delete filterCriteria.tree_associated;
    }

    const captures = await where.where({ ...filterCriteria})
      .select('*')
      .from('capture')
      .orderBy('created_at', 'desc')
      .limit(Number(options.limit))
      .offset(Number(options.offset));

    const { count } = await this._session
      .getDB()
      .where({ ...filterCriteria })
      .whereNot({ status: 'deleted' })
      .count('*')
      .from('capture')
      .first();

    return { captures, count: Number(count) };
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
        device_configuration_id,
        session_id,
        status,
        grower_id,
        planting_organization_id,
        estimated_geometric_location,
        estimated_geographic_location,
        captured_at,
        updated_at
      )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ST_PointFromText(?, 4326), ST_PointFromText(?, 4326), ?, now());`,
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
        capture.device_configuration_id,
        capture.session_id,
        capture.status,
        capture.grower_id,
        capture.planting_organization_id,
        capture.point,
        capture.point,
        capture.captured_at
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
