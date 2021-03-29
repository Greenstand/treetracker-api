const BaseRepository = require('./BaseRepository');

class RawCaptureRepository extends BaseRepository {
  constructor(session) {
    super('raw_capture', session);
    this._tableName = 'raw_capture';
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

  async add(rawCapture) {
    console.log('PG REPOSITORY DB getByFilter', rawCapture);
    return await super.create(rawCapture);
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
  RawCaptureRepository,
  EventRepository,
};
