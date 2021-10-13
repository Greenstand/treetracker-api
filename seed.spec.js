const { expect } = require('chai');
const Crypto = require('crypto');
const log = require('loglevel');
const pool = require('./server/infra/database/knex');
const seed = require('./seed');
const knex = require('./server/infra/database/knex');

// Run the seed, and check that it's working

describe('Seed data into DB', () => {
  before(async () => {
    await seed.clear();
    await seed.seed();
  });

  after(async () => {
    await seed.clear();
  });

  describe('Should find a token', () => {
    let token;

    before(async () => {
      expect(seed.token).to.have.property('id');
      const r = await pool.query(
        `select * from token where id = '${seed.token.id}'`,
      );
      expect(r).to.have.property('rows').to.have.lengthOf(1);
      token = r.rows[0];
    });

    it('Token should match tree/entity id', () => {
      expect(token).to.have.property('tree_id').to.equal(seed.tree.id);
      expect(token).to.have.property('entity_id').to.equal(seed.wallet.id);
    });
  });
});
