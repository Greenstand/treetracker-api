const request = require('supertest');
const chai = require('chai');
const { v4: uuid } = require('uuid');

const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const app = require('../../../server/app');
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
    await knex('grower_account_org').del();
    await knex('grower_account').del();
  });

  describe('POST', () => {
    it('should create a grower account', async () => {
      const res = await request(app)
        .post(`/grower_accounts`)
        .send(grower_account1)
        .set('Accept', 'application/json')
        .expect(201);

      expect(res.body).include({
        ...grower_account1,
      });
      expect(res.body.organizations.length).to.eql(0);

      const res2 = await request(app)
        .post(`/grower_accounts`)
        .send(grower_account2)
        .set('Accept', 'application/json')
        .expect(201);

      expect(res2.body).include({
        ...grower_account2,
      });
      expect(res2.body.organizations.length).to.eql(0);
    });

    it('should not error out if duplicate wallet is sent', async () => {
      const res = await request(app)
        .post(`/grower_accounts`)
        .send(grower_account1)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).include({
        ...grower_account1,
      });
      expect(res.body.organizations.length).to.eql(0);
    });
  });

  describe('PATCH', () => {
    before(async () => {
      const growerAccount = await knex('grower_account').select('id');
      grower_account1.id = growerAccount[0].id;
    });

    it('should uodate a grower account', async () => {
      const res = await request(app)
        .patch(`/grower_accounts/${grower_account1.id}`)
        .send(growerAccountUpdates)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).to.include({
        ...grower_account1,
        ...growerAccountUpdates,
      });
    });
  });

  describe('GET', () => {
    const organizationId = uuid();

    before(async () => {
      await knex('grower_account_org').insert({
        organization_id: organizationId,
        grower_account_id: grower_account1.id,
      });
    });

    it('should get grower account', async () => {
      const result = await request(app).get(`/grower_accounts`).expect(200);
      expect(result.body.grower_accounts.length).to.eql(2);
      expect(result.body.links).to.have.keys(['prev', 'next']);
      expect(result.body.grower_accounts)
        .to.be.an('array')
        .that.contains.something.like({
          ...grower_account1,
          ...growerAccountUpdates,
        });
    });

    it('should get grower account -- by id', async () => {
      const result = await request(app)
        .get(`/grower_accounts/${grower_account1.id}`)
        .expect(200);
      expect(result.body).to.include({
        ...grower_account1,
        ...growerAccountUpdates,
      });

      expect(result.body.organizations[0]).to.eql(organizationId);
    });

    it('should delete a grower account', async () => {
      await request(app)
        .patch(`/grower_accounts/${grower_account1.id}`)
        .send({ status: 'deleted' })
        .set('Accept', 'application/json')
        .expect(200);

      const result = await request(app).get(`/grower_accounts`).expect(200);
      expect(result.body.grower_accounts.length).to.eql(1);
      expect(result.body.links).to.have.keys(['prev', 'next']);
    });
  });

  describe('PUT', () => {
    it('should update a grower account with the same wallet', async () => {
      delete grower_account1.id;
      const result = await request(app)
        .put(`/grower_accounts`)
        .send({ ...grower_account1, wallet: grower_account2.wallet })
        .set('Accept', 'application/json')
        .expect(200);

      expect(result.body).to.include({
        ...grower_account2,
        first_name: grower_account1.first_name,
        last_name: grower_account1.last_name,
        email: grower_account1.email,
        phone: grower_account1.phone,
        lat: grower_account1.lat,
        lon: grower_account1.lon,
      });
    });
  });
});
