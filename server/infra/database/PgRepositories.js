const BaseRepository = require('./BaseRepository');

class TreeRepository extends BaseRepository {
  constructor(session) {
    super('tree', session);
    this._tableName = 'tree';
    this._session = session;
  }

  async add(tree) {
    const wellKnownText = `POINT(${tree.lon} ${tree.lat})`;
    const result = await this._session.getDB().raw(`insert into treetracker.tree (
         id, lat, lon, location, latest_capture_id, image_url, species_id, age, morphology, 
         status, created_at, updated_at) 
         values(?, ?, ?, ST_PointFromText(?, 4326), ?, ?, ?, ?, ?, ?, ?, ?)
         returning id`,
         [tree.id, tree.lat, tree.lon, wellKnownText, tree.latest_capture_id, tree.image_url,
          tree.species_id, tree.age, tree.morphology, tree.status, tree.created_at,
          tree.updated_at]);
    return result.rows[0];
  }
}

class CaptureRepository extends BaseRepository {
  constructor(session) {
    super('capture', session);
    this._tableName = 'capture';
    this._session = session;
  }

  async getByFilter(filterCriteria, options) {
    console.log('PG REPOSITORY DB getByFilter', filterCriteria, options);
    const query = !!Object.keys(filterCriteria).length
      ? filterCriteria
      : `id` > 10;
    return await this._session
      .getDB()
      .where(filterCriteria)
      .select(
        'id',
        'reference_id',
        'image_url',
        'lat',
        'lon',
        'gps_accuracy',
        'planter_id',
        'planter_photo_url',
        'planter_username',
        'device_identifier',
        'note',
        'morphology',
        'age',
        'attributes',
        'status',
        'created_at',
        'updated_at',
      )
      .from('treetracker.capture')
      .orderBy('created_at', 'desc')
      .limit(options.limit)
      .offset(options.offset);
  }

  async add(capture) {
    return await super.create(capture);
  }
}

class EventRepository extends BaseRepository {
  constructor(session) {
    super('domain_event', session);
    this._tableName = 'domain_event';
    this._session = session;
  }

  async add(domainEvent) {
    return await super.create(domainEvent);
  }
}

module.exports = {
  CaptureRepository,
  EventRepository,
  TreeRepository
};
