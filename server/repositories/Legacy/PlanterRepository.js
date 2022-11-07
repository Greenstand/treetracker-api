const BaseRepository = require('../BaseRepository');

class LegacyPlanterRepository extends BaseRepository {
  constructor(session) {
    super('planter', session);
    this._tableName = 'planter';
    this._session = session;
  }

  async findUser(planter_identifier) {
    return this._session
      .getDB()
      .select()
      .table(this._tableName)
      .where({ phone: planter_identifier })
      .orWhere({ email: planter_identifier })
      .first();
  }
}

module.exports = LegacyPlanterRepository;
