const knex = require('../database/knex');
const GrowerAccountRepository = require('../repositories/GrowerAccountRepository');

class GrowerAccount {
  constructor(session) {
    this._growerAccountRepository = new GrowerAccountRepository(session);
  }

  static GrowerAccount({
    id,
    wallet,
    person_id,
    organization_id,
    first_name,
    last_name,
    email,
    phone,
    lat,
    lon,
    location,
    image_url,
    image_rotation,
    organizations = [],
    status,
    first_registration_at,
    created_at,
    updated_at,
  }) {
    return Object.freeze({
      id,
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
      image_url,
      image_rotation,
      organizations,
      status,
      first_registration_at,
      created_at,
      updated_at,
    });
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
      return this.constructor.GrowerAccount(rowCopy);
    });
  }

  async getGrowerAccountsCount(filter) {
    return this._growerAccountRepository.countByFilter(filter);
  }

  async getGrowerAccountById(growerAccountId) {
    const growerAccount = await this._growerAccountRepository.getById(
      growerAccountId,
    );
    return this.constructor.GrowerAccount(growerAccount);
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
      status = 201;
      growerAccount = await this._growerAccountRepository.create({
        location: knex.raw(
          `ST_PointFromText('POINT( ${growerAccountToCreate.lon} ${growerAccountToCreate.lat}) ', 4326)`,
        ),
        ...growerAccountToCreate,
      });
    }

    return { status, growerAccount };
  }

  async updateGrowerAccount(updateObject) {
    return this._growerAccountRepository.update({
      ...updateObject,
      updated_at: new Date().toISOString(),
    });
  }

  async upsertGrowerAccount(growerAccountObject) {
    const { wallet, first_name, last_name, phone, email, location, lat, lon } =
      growerAccountObject;

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
        lat,
        lon,
        updated_at: new Date().toISOString(),
      });
    } else {
      const result = await this.createGrowerAccount(growerAccountObject);
      growerAccount = result.growerAccount;
      status = result.status;
    }

    return { status, growerAccount };
  }
}

module.exports = GrowerAccount;
