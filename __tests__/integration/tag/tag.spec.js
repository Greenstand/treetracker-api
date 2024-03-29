const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../server/app');
const tag1 = require('../../mock/tag1.json');
const { knex } = require('../../utils');

describe('/tag', () => {
  const tagUpdates = {
    isPublic: true,
  };

  after(async () => {
    await knex('tag').del();
  });

  describe('POST', () => {
    it('should create a tag', async () => {
      const res = await request(app)
        .post(`/tags`)
        .send(tag1)
        .set('Accept', 'application/json')
        .expect(201);

      expect(res.body).to.include({ ...tag1 });
    });

    it('should error out -- tag name and owner_id already exists', async () => {
      const result = await request(app)
        .post(`/tags`)
        .send(tag1)
        .set('Accept', 'application/json')
        .expect(422);

      expect(result.body.message).to.equal(
        'Tag name "tag1" already exists for this organization',
      );
    });

    it('should create tag name for other organizations', async () => {
      const owner_id = '20a3b254-d6c1-47d9-8816-397df39ad88e';
      const res = await request(app)
        .post(`/tags`)
        .send({ ...tag1, owner_id })
        .set('Accept', 'application/json')
        .expect(201);

      expect(res.body).to.include({ ...tag1, owner_id });
    });
  });

  describe('PATCH', () => {
    it('should uodate a tag', async () => {
      const tagId = await knex('tag')
        .select('id')
        .where({ ...tag1 });

      const result = await request(app)
        .patch(`/tags/${tagId[0].id}`)
        .send(tagUpdates)
        .set('Accept', 'application/json')
        .expect(200);

      expect(result.body).to.include({ ...tag1, ...tagUpdates });
    });
  });

  describe('GET', () => {
    it('should get a single tag', async () => {
      const tagId = await knex('tag')
        .select('id')
        .where({ ...tagUpdates });

      const result = await request(app).get(`/tags/${tagId[0].id}`).expect(200);
      expect(result.body).to.include({ ...tag1, ...tagUpdates });
    });

    it('should get tags', async () => {
      const result = await request(app).get(`/tags`).expect(200);
      expect(result.body.tags.length).to.eql(2);
      expect(result.body.links).to.have.keys(['prev', 'next']);
    });

    it('should delete a tag', async () => {
      const tagId = await knex('tag')
        .select('id')
        .where({ ...tagUpdates });
      await request(app)
        .patch(`/tags/${tagId[0].id}`)
        .send({ status: 'deleted' })
        .set('Accept', 'application/json')
        .expect(200);
    });

    it('should get tags --should be empty', async () => {
      const result = await request(app).get(`/tags`).expect(200);
      expect(result.body.tags.length).to.eql(1);
      expect(result.body.links).to.have.keys(['prev', 'next']);
    });
  });
});
