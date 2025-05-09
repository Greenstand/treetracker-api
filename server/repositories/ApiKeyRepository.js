const BaseRepository = require('./BaseRepository');

class ApiKeyRepository extends BaseRepository {
  constructor(session) {
    super('api_key', session);
    this._tableName = 'api_key';
    this._session = session;
  }

  async getByApiKey(key) {
    return this._session
      .getDB()
      .select()
      .table(this._tableName)
      .where({ key })
      .first();
  }
}

module.exports = ApiKeyRepository;
