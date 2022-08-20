const BaseRepository = require('./BaseRepository');

class EventRepository extends BaseRepository {
  constructor(session) {
    super('domain_event', session);
    this._tableName = 'domain_event';
    this._session = session;
  }

  async add(domainEvent) {
    return super.create(domainEvent);
  }

  async getDomainEvent(payloadReferenceId) {
    const data = await this._session
      .getDB()
      .raw(`select * from domain_event where payload ->> 'reference_id' = ?;`, [
        payloadReferenceId,
      ]);

    return data.rows[0];
  }
}

module.exports = EventRepository;
