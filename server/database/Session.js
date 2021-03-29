/*
 * A object to indicate current session, currently, use for database session, like a transaction session.
 * So with knowing the current database transaction session, we can easily break the current process, and
 * rollback the operation, and if encounter any accidentally problem or failure, we can rollback all
 * operations.
 *
 * Note: `dataMigration` is temporary property that lets Session object use a different database connection
 * instead of the default database used for the service. This feature is introduced for domain migration
 * project (monolith app/db into separate bounded domain services/dbs) that requires data to be written to
 * select databases for backward compatability. These extra db write capabilities will be removed once
 * services are succesfully separated from the monolith.
 */

const { knex, knexMainDB } = require('./knex');

class Session {
  constructor(dataMigration = false) {
    this.thx = undefined;
    this.dataMigration = dataMigration;
  }

  getDB() {
    console.log('SESSION getDB', this.thx, this.dataMigration);
    if (this.thx) {
      return this.thx;
    } else {
      return this.dataMigration ? knexMainDB : knex;
    }
  }

  isTransactionInProgress() {
    return this.thx != undefined;
  }

  async beginTransaction() {
    if (this.thx) {
      throw new Error('Can not start transaction in transaction');
    }
    this.thx = this.dataMigration
      ? await knexMainDB.transaction()
      : await knex.transaction();
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
