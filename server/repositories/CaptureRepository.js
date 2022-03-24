const BaseRepository = require('./BaseRepository');

class CaptureRepository extends BaseRepository {
  constructor(session) {
    super('capture', session);
    this._tableName = 'capture';
    this._session = session;
  }

  _filterWhereBuilder(object, builder) {
    const result = builder;
    const {
      parameters,
      whereNulls = [],
      whereNotNulls = [],
      whereIns = [],
    } = { ...object };
    result.whereNot({ status: 'deleted' });
    whereNotNulls.forEach((whereNot) => {
      result.whereNotNull(whereNot);
    });

    whereNulls.forEach((whereNull) => {
      result.whereNull(whereNull);
    });

    whereIns.forEach((whereIn) => {
      result.whereIn(whereIn.field, whereIn.values);
    });

    const filterObject = { ...parameters };

    if (filterObject.captured_at_start_date) {
      result.where(
        `${this._tableName}.captured_at`,
        '>=',
        filterObject.captured_at_start_date,
      );
      delete filterObject.captured_at_start_date;
    }
    if (filterObject.captured_at_end_date) {
      result.where(
        `${this._tableName}.captured_at`,
        '<=',
        filterObject.captured_at_end_date,
      );
      delete filterObject.captured_at_end_date;
    }
    result.where(filterObject);
  }

  async getByFilter(filterCriteria, options = {}) {
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
        created_at,
        status,
        captured_at, 
        t.tag_array
          FROM capture
          LEFT JOIN (
              SELECT ct.capture_id, array_agg(t.name) AS tag_array
              FROM capture_tag ct
              JOIN tag t  ON t.id = ct.tag_id
              GROUP BY ct.capture_id
            ) t ON id = t.capture_id
        `,
        ),
      )
      .where((builder) => this._filterWhereBuilder(filterCriteria, builder));

    promise = promise.orderBy(
      filterCriteria?.sort?.order_by || 'created_at',
      filterCriteria?.sort?.order || 'desc',
    );

    const { limit, offset } = options;
    if (limit) {
      promise = promise.limit(limit);
    }
    if (offset) {
      promise = promise.offset(offset);
    }

    const captures = await promise;

    return captures;
  }

  async countByFilter(filter) {
    const { count } = await this._session
      .getDB()
      .count('*')
      .where((builder) => this._filterWhereBuilder(filter, builder))
      .from(this._tableName)
      .first();

    return Number(count);
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
        species_id,
        morphology,
        age,
        note,
        attributes,
        domain_specific_data,
        device_configuration_id,
        session_id,
        status,
        grower_account_id,
        planting_organization_id,
        estimated_geometric_location,
        estimated_geographic_location,
        captured_at,
        updated_at
      )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ST_PointFromText(?, 4326), ST_PointFromText(?, 4326), ?, now());`,
      [
        capture.id,
        capture.reference_id,
        capture.tree_id,
        capture.image_url,
        capture.lat,
        capture.lon,
        capture.gps_accuracy,
        capture.species_id,
        capture.morphology,
        capture.age,
        capture.note,
        capture.attributes,
        capture.domain_specific_data,
        capture.device_configuration_id,
        capture.session_id,
        capture.status,
        capture.grower_account_id,
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
