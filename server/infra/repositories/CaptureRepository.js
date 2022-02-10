const BaseRepository = require('./BaseRepository');

class CaptureRepository extends BaseRepository {
  constructor(session) {
    super('capture', session);
    this._tableName = 'capture';
    this._session = session;
  }

  async getByFilter(filterCriteria, options = {}) {
    const whereBuilder = function (object, builder) {
      const result = builder;
      const { parameters, whereNulls = [], whereNotNulls = [] } = { ...object };
      result.whereNot({ status: 'deleted' });
      for (const whereNot of whereNotNulls) {
        result.whereNotNull(whereNot);
      }

      for (const whereNull of whereNulls) {
        result.whereNull(whereNull);
      }

      const filterObject = { ...parameters };

      if (filterObject.captured_at_start_date) {
        result.where(
          'capture.captured_at',
          '>=',
          filterObject.captured_at_start_date,
        );
        delete filterObject.captured_at_start_date;
      }
      if (filterObject.captured_at_end_date) {
        result.where(
          'capture.captured_at',
          '<=',
          filterObject.captured_at_end_date,
        );
        delete filterObject.captured_at_end_date;
      }
      result.where(filterObject);
    };

    const knex = this._session.getDB();

    let promise = knex
      .select(
        knex.raw(
          `
        id,
        tree_id,
        planting_organization_id,
        image_url,
        lat,
        lon,
        grower_photo_url,
        grower_username,
        created_at,
        status,
        captured_at, 
        t.tag_array
          FROM capture
          LEFY JOIN (
              SELECT ct.capture_id, array_agg(t.name) AS tag_array
              FROM capture_tag ct
              JOIN tag t  ON t.id = ct.tag_id
              GROUP BY ct.capture_id
            ) t ON id = t.capture_id
        `,
        ),
      )
      .where((builder) => whereBuilder(filterCriteria, builder))
      .orderBy('created_at', 'desc');

    const { limit, offset } = options;
    if (limit) {
      promise = promise.limit(limit);
    }
    if (offset) {
      promise = promise.offset(offset);
    }

    const captures = await promise;

    const { count } = await knex
      .count('*')
      .where((builder) => whereBuilder(filterCriteria, builder))
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
        capture.captured_at,
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
