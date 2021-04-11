const { knex } = require('./knex');

class Session {
  constructor() {
    this.thx = undefined;
  }

  getDB() {
    console.log('SESSION getDB');
    if (this.thx) {
      return this.thx;
    } else {
      return knex;
    }
  }

  isTransactionInProgress() {
    return this.thx != undefined;
  }

  async beginTransaction() {
    if (this.thx) {
      throw new Error('Can not start transaction in transaction');
    }
    this.thx = await knex.transaction();
  }

  async commitTransaction() {
    if (!this.thx) {
      throw new Error('Can not commit transaction before start it!');
    }
    await this.thx.commit();
    this.thx = undefined;
  }

  async rollbackTransaction() {
    if (!this.thx) {
      throw new Error('Can not rollback transaction before start it!');
    }
    await this.thx.rollback();
    this.thx = undefined;
  }
}

module.exports = Session;
