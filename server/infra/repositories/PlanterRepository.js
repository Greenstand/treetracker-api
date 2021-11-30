const BaseRepository = require('./BaseRepository');

class PlanterRepository extends BaseRepository {
  constructor(session) {
    super('planter', session);
    this._tableName = 'planter';
    this._session = session;
  }

  async getPlantersByOrganization(organization_id, options) {
    const limit = options.limit;
    const offset = options.offset;
    const planters = await this._session.getDB().raw(
      `SELECT planter.* FROM public.planter JOIN public.entity ON planter.organization_id = entity.id WHERE stakeholder_uuid = ? 
        ${limit ? `LIMIT ${limit}` : ''} ${offset ? `OFFSET ${offset}` : ''}`,
      [organization_id],
    );

    return planters.rows;
  }
}

module.exports = PlanterRepository;
