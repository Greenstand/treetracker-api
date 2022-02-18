const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../app');
const grower_account1 = require('../../mock/grower_account1.json');
const grower_account2 = require('../../mock/grower_account2.json');
const { knex } = require('../../utils');

describe('/grower_account', () => {
  const growerAccountUpdates = {
    person_id: 'df9541b7-4bf4-4c8b-8711-f42f66bc50cc',
    first_name: 'name',
    last_name: 'name2',
    email: 'name@email.com',
    phone: '1234567',
    image_url: 'https://www.himage.com',
    image_rotation: 44,
  };

  after(async () => {
    await knex('grower_account').del();
  });

  describe('POST', () => {
    it('should create a grower account', async () => {
      await request(app)
        .post(`/grower_accounts`)
        .send(grower_account1)
        .set('Accept', 'application/json')
        .expect(204);
    });

    it('should not error out if duplicate wallet is sent', async () => {
      await request(app)
        .post(`/grower_accounts`)
        .send(grower_account1)
        .set('Accept', 'application/json')
        .expect(204);
    });
  });

  describe('PATCH', () => {
    before(async () => {
      const growerAccount = await knex('grower_account').select('id');
      grower_account1.id = growerAccount[0].id;
    });

    it('should uodate a grower account', async () => {
      await request(app)
        .patch(`/grower_accounts/${grower_account1.id}`)
        .send(growerAccountUpdates)
        .set('Accept', 'application/json')
        .expect(204);

      const result = await request(app)
        .get(`/grower_accounts/${grower_account1.id}`)
        .expect(200);
      expect(result.body).to.include({
        ...grower_account1,
        ...growerAccountUpdates,
      });
    });
  });

  describe('GET', () => {
    it('should get grower account', async () => {
      const result = await request(app).get(`/grower_accounts`).expect(200);
      expect(result.body.grower_accounts.length).to.eql(1);
      expect(result.body.links).to.have.keys(['prev', 'next']);
      expect(result.body.grower_accounts[0]).to.include({
        ...grower_account1,
        ...growerAccountUpdates,
      });
    });

    it('should delete a grower account', async () => {
      await request(app)
        .patch(`/grower_accounts/${grower_account1.id}`)
        .send({ status: 'deleted' })
        .set('Accept', 'application/json')
        .expect(204);

      const result = await request(app).get(`/grower_accounts`).expect(200);
      expect(result.body.grower_accounts.length).to.eql(0);
      expect(result.body.links).to.have.keys(['prev', 'next']);
    });
  });

  describe('PUT', () => {
    it('should update a grower account with the same wallet', async () => {
      const result = await request(app)
        .put(`/grower_accounts`)
        .send({ ...grower_account2, wallet: grower_account1.wallet })
        .set('Accept', 'application/json')
        .expect(200);

      expect(result.body).to.include({
        ...grower_account1,
        ...growerAccountUpdates,
        first_name: grower_account2.first_name,
        last_name: grower_account2.last_name,
        email: grower_account2.email,
        phone: grower_account2.phone,
      });
    });
  });
});
