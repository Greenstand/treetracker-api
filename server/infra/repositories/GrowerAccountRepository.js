const BaseRepository = require('./BaseRepository');

class GrowerAccountRepository extends BaseRepository {
  constructor(session) {
    super('grower_account', session);
    this._tableName = 'grower_account';
    this._session = session;
  }
}

module.exports = GrowerAccountRepository;
