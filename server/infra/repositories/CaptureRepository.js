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
    
    const query = Object.keys(filterCriteria).length
      ? filterCriteria
      : `id` > 10;

    return this._session
      .getDB()
      .where(filterCriteria)
      .select('*')
      .from('treetracker.capture')
      .orderBy('created_at', 'desc')
      .limit(options.limit)
      .offset(options.offset);
  }

  async add(capture) {
    return super.create(capture);
  }
}

module.exports = CaptureRepository;