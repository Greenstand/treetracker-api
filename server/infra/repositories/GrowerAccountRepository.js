const BaseRepository = require('./BaseRepository');

class GrowerAccountRepository extends BaseRepository {
  constructor(session) {
    super('grower_account', session);
    this._tableName = 'grower_account';
    this._session = session;
  }

  async updateInfo(object) {
    const result = await this._session
      .getDB()(this._tableName)
      .update(object)
      .where('wallet', object.wallet)
      .returning('*');
    return result[0];
  }
}

module.exports = GrowerAccountRepository;
