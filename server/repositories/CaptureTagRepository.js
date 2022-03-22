const BaseRepository = require('./BaseRepository');

class CaptureTagRepository extends BaseRepository {
  constructor(session) {
    super('capture_tag', session);
    this._tableName = 'capture_tag';
    this._session = session;
  }

  async getCaptureTags(filter) {
    const whereBuilder = function (object, builder) {
      const result = builder;
      result.where({ ...object, 'capture_tag.status': 'active' });

      return result;
    };

    return this._session
      .getDB()
      .select(
        'capture_tag.id as id',
        'capture.id as capture_id',
        'tag.id as tag_id',
        'tag.name as tag_name',
        'capture_tag.status as status',
        'capture_tag.created_at',
        'capture_tag.updated_at',
      )
      .table(this._tableName)
      .join('capture', 'capture_tag.capture_id', 'capture.id')
      .join('tag', 'capture_tag.tag_id', 'tag.id')
      .where((builder) => whereBuilder(filter, builder));
  }

  async update(object) {
    return this._session
      .getDB()(this._tableName)
      .update(object)
      .where({ capture_id: object.capture_id, tag_id: object.tag_id });
  }
}

module.exports = CaptureTagRepository;
