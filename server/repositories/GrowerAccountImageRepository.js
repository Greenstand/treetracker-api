const BaseRepository = require('./BaseRepository');

class GrowerAccountImageRepository extends BaseRepository {
  constructor(session) {
    super('grower_account_image', session);
    this._tableName = 'grower_account_image';
    this._session = session;
  }
}

module.exports = GrowerAccountImageRepository;
