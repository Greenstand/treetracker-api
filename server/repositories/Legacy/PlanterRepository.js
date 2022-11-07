const BaseRepository = require('../BaseRepository');

class LegacyPlanterRepository extends BaseRepository {
  constructor(session) {
    super('planter', session);
    this._tableName = 'planter';
    this._session = session;
  }
}

module.exports = LegacyPlanterRepository;
