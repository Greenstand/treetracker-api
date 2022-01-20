const BaseRepository = require('./BaseRepository');

class TagRepository extends BaseRepository {
  constructor(session) {
    super('tag', session);
    this._tableName = 'tag';
    this._session = session;
  }
}

module.exports = TagRepository;
