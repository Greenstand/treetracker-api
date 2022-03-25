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

      expect(res.body.tag).to.include({ ...tag1 });
    });

    it('should error out -- tag name already exists', async () => {
      const result = await request(app)
        .post(`/tags`)
        .send(tag1)
        .set('Accept', 'application/json')
        .expect(422);

      expect(result.body.message).to.equal('Tag name already exists');
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

      expect(result.body.tag).to.include({ ...tag1, ...tagUpdates });
    });
  });

  describe('GET', () => {
    it('should get a single tag', async () => {
      const tagId = await knex('tag')
        .select('id')
        .where({ ...tagUpdates });

      const result = await request(app).get(`/tags/${tagId[0].id}`).expect(200);
      expect(result.body.tag).to.include({ ...tag1, ...tagUpdates });
    });

    it('should get tags', async () => {
      const result = await request(app).get(`/tags`).expect(200);
      expect(result.body.tags.length).to.eql(1);
      expect(result.body.links).to.have.keys(['prev', 'next']);
      expect(result.body.tags[0]).to.include({ ...tag1, ...tagUpdates });
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
      expect(result.body.tags.length).to.eql(0);
      expect(result.body.links).to.have.keys(['prev', 'next']);
    });
  });
});
