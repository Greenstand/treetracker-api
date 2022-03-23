const Session = require('../models/Session');
const GrowerAccount = require('../models/GrowerAccount');

class GrowerAccountService {
  constructor() {
    this._session = new Session();
    this._growerAccount = new GrowerAccount(this._session);
  }

  async getGrowerAccounts(filter, limitOptions) {
    return this._growerAccount.getGrowerAccounts(filter, limitOptions);
  }

  async getGrowerAccountsCount(filter) {
    return this._growerAccount.getGrowerAccountsCount(filter);
  }

  async getGrowerAccountById(growerAccountId) {
    return this._growerAccount.getGrowerAccountById(growerAccountId);
  }

  async createGrowerAccount(growerAccountToCreate) {
    try {
      await this._session.beginTransaction();
      const { status, growerAccount } =
        await this._growerAccount.createGrowerAccount(growerAccountToCreate);
      await this._session.commitTransaction();

      return { status, growerAccount };
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async updateGrowerAccount(growerAccountObject) {
    return this._growerAccount.updateGrowerAccount(growerAccountObject);
  }

  async upsertGrowerAccount(growerAccountObject) {
    try {
      await this._session.beginTransaction();
      const growerAccount = await this._growerAccount.upsertGrowerAccount(
        growerAccountObject,
      );
      await this._session.commitTransaction();

      return growerAccount;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }
}

module.exports = GrowerAccountService;
