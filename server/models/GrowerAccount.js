const knex = require('../infra/database/knex');
const GrowerAccountRepository = require('../repositories/GrowerAccountRepository');
const LegacyPlanterRepository = require('../repositories/Legacy/PlanterRepository');

class GrowerAccount {
  constructor(session) {
    this._session = session;
    this._growerAccountRepository = new GrowerAccountRepository(session);
  }

  static GrowerAccount({
    id,
    reference_id,
    wallet,
    person_id,
    organization_id,
    first_name,
    last_name,
    email,
    phone,
    about,
    lat,
    lon,
    location,
    image_url,
    image_rotation,
    organizations = [],
    images = [],
    status,
    first_registration_at,
    gender,
    bulk_pack_file_name,
    created_at,
    updated_at,
    show_in_map,
  }) {
    return Object.freeze({
      id,
      reference_id,
      wallet,
      person_id,
      organization_id,
      first_name,
      last_name,
      email,
      lat,
      lon,
      location,
      phone,
      about,
      image_url,
      image_rotation,
      organizations,
      images,
      status,
      first_registration_at,
      gender,
      bulk_pack_file_name,
      created_at,
      updated_at,
      show_in_map,
    });
  }

  _response(growerAccount) {
    return this.constructor.GrowerAccount(growerAccount);
  }

  async getGrowerAccounts(filter, options, getAll) {
    const growerAccounts = await this._growerAccountRepository.getByFilter(
      { ...filter, getAll },
      options,
    );

    return growerAccounts.map((row) => {
      const rowCopy = { ...row };
      if (rowCopy.organizations[0] === null) {
        rowCopy.organizations = [];
      }
      return this._response(rowCopy);
    });
  }

  async getGrowerAccountsCount(filter) {
    return this._growerAccountRepository.countByFilter({
      ...filter,
      status: 'active',
    });
  }

  async getGrowerAccountById(growerAccountId) {
    const growerAccounts = await this._growerAccountRepository.getByFilter({
      'grower_account.id': growerAccountId,
    });
    const [growerAccount = {}] = growerAccounts;
    return this._response(growerAccount);
  }

  async createGrowerAccount(growerAccountToCreate) {
    let status = 200;
    const existingGrowerAccount = await this.getGrowerAccounts(
      { wallet: growerAccountToCreate.wallet },
      undefined,
      true,
    );

    let [growerAccount] = existingGrowerAccount;

    if (!growerAccount) {
      const planterRepository = new LegacyPlanterRepository(this._session);
      status = 201;
      const createdGrowerAccount = await this._growerAccountRepository.create({
        location: knex.raw(
          `ST_PointFromText('POINT( ${growerAccountToCreate.lon} ${growerAccountToCreate.lat}) ', 4326)`,
        ),
        ...growerAccountToCreate,
      });
      const planter = await planterRepository.create({
        first_name: createdGrowerAccount.first_name,
        last_name: createdGrowerAccount.last_name,
        phone: createdGrowerAccount.phone,
        email: createdGrowerAccount.email,
        grower_account_uuid: createdGrowerAccount.id,
      });
      growerAccount = await this._growerAccountRepository.update({
        id: createdGrowerAccount.id,
        reference_id: planter.id,
      });
    }

    return { status, growerAccount: this._response(growerAccount) };
  }

  async updateGrowerAccount(updateObject) {
    const updatedGrowerAccount = await this._growerAccountRepository.update({
      ...updateObject,
      updated_at: new Date().toISOString(),
    });

    return this._response(updatedGrowerAccount);
  }

  async upsertGrowerAccount(growerAccountObject) {
    const {
      wallet,
      first_name,
      last_name,
      phone,
      about,
      email,
      location,
      lat,
      lon,
      gender,
    } = growerAccountObject;

    const existingGrowerAccount = await this.getGrowerAccounts({
      wallet,
    });

    let growerAccount = {};
    let status = 200;

    if (existingGrowerAccount.length > 0) {
      growerAccount = await this._growerAccountRepository.updateInfo({
        wallet,
        phone,
        first_name,
        last_name,
        location,
        email,
        about,
        gender,
        lat,
        lon,
        updated_at: new Date().toISOString(),
      });
    } else {
      const result = await this.createGrowerAccount(growerAccountObject);
      growerAccount = result.growerAccount;
      status = result.status;
    }

    return { status, growerAccount: this._response(growerAccount) };
  }
}

module.exports = GrowerAccount;
