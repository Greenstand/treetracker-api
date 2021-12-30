const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../app');
const tag1 = require('../../mock/tag1.json');
const { knex } = require('../../utils');

describe('/tag', () => {
  const tagUpdates = {
    status: 'deleted',
    isPublic: true,
  };

  after(async () => {
    await knex('tag')
      .where({ ...tag1, ...tagUpdates })
      .del();
  });

  describe('POST', () => {
    it('should create a tag', async () => {
      await request(app)
        .post(`/tags`)
        .send(tag1)
        .set('Accept', 'application/json')
        .expect(204);
    });
  });

  describe('PATCH', () => {
    it('should uodate a tag', async () => {
      const tagId = await knex('tag')
        .select('id')
        .where({ ...tag1 });
      await request(app)
        .patch(`/tags/${tagId[0].id}`)
        .send(tagUpdates)
        .set('Accept', 'application/json')
        .expect(204);
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
      expect(result.body.tags.length).to.eql(1);
      expect(result.body.links).to.have.keys(['prev', 'next']);
      expect(result.body.tags[0]).to.include({ ...tag1, ...tagUpdates });
    });
  });
});
