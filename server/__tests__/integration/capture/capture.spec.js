const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../app');
const capture2 = require('../../mock/capture2.json');
const capture1 = require('../../mock/capture1.json');
const tag2 = require('../../mock/tag2.json');
const grower_account2 = require('../../mock/grower_account2.json');
const domain_event2 = require('../../mock/domain_event2.json');
const { knex, addCapture } = require('../../utils');

describe('/captures', () => {
  const captureUpdates = {
    tree_id: null,
    species_id: '12e2c0f6-b7df-43e3-8899-674e90b292d9',
    morphology: 'yyggollohhprom',
    age: 44,
  };

  const modCapture = {
    ...capture2,
    attributes: { entries: capture2.attributes },
  };

  const updatedModCapture = { ...modCapture, ...captureUpdates };
  before(async () => {
    await knex('grower_account').insert({
      ...grower_account2,
      status: 'active',
    });
  });

  after(async () => {
    await knex('capture')
      .where({ ...updatedModCapture })
      .del();

    await knex('grower_account')
      .where({ ...grower_account2 })
      .del();
  });

  describe('POST', () => {
    before(async () => {
      await addCapture({
        ...capture1,
        estimated_geometric_location: 'POINT(50 50)',
      });
      await knex('domain_event').insert({ ...domain_event2 });
    });

    it('should create a capture', async () => {
      await request(app)
        .post(`/captures`)
        .send(capture2)
        .set('Accept', 'application/json')
        .expect(204);
    });

    it('should not error out when duplicate data is sent', async () => {
      await request(app)
        .post(`/captures`)
        .send(capture2)
        .set('Accept', 'application/json')
        .expect(204);
    });

    it('should resend capture created event if it wasnt successful last time and capture already exists', async () => {
      await request(app)
        .post(`/captures`)
        .send({ ...capture2, id: capture1.id })
        .set('Accept', 'application/json')
        .expect(204);
    });

    after(async () => {
      await knex('capture')
        .where({ ...capture1 })
        .del();

      const result = await knex('domain_event').where({ status: 'sent' }).del();
      expect(result).to.eql(2);
    });
  });

  describe('PATCH', () => {
    it('should uodate a capture', async () => {
      const captureId = await knex('capture')
        .select('id')
        .where({ ...modCapture });
      await request(app)
        .patch(`/captures/${captureId[0].id}`)
        .send(captureUpdates)
        .set('Accept', 'application/json')
        .expect(204);
    });
  });

  describe('GET', () => {
    it('should get a single capture', async () => {
      const copy = { ...updatedModCapture };
      const captureId = await knex('capture')
        .select('id')
        .where({ ...copy });
      const result = await request(app)
        .get(`/captures/${captureId[0].id}`)
        .expect(200);
      expect(result.body.attributes.entries).to.eql(copy.attributes.entries);
      delete copy.attributes;
      expect(result.body).to.include({ ...copy });
    });

    it('should get captures', async () => {
      const result = await request(app).get(`/captures`).expect(200);
      const copy = { ...updatedModCapture };
      expect(result.body.length).to.eql(1);
      expect(result.body[0].attributes.entries).to.eql(copy.attributes.entries);
      delete copy.attributes;
      expect(result.body[0]).to.include({ ...copy });
    });

    it('should delete a capture', async () => {
      const captureId = await knex('capture')
        .select('id')
        .where({ ...updatedModCapture });
      await request(app)
        .patch(`/captures/${captureId[0].id}`)
        .send({ status: 'deleted' })
        .set('Accept', 'application/json')
        .expect(204);
    });

    it('should get captures -- should be empty', async () => {
      const result = await request(app).get(`/captures`).expect(200);
      const copy = { ...updatedModCapture };
      expect(result.body.length).to.eql(0);
    });
  });

  describe('/captures/capture_id/tags', () => {
    let captureId;

    before(async () => {
      const capture = await knex('capture')
        .select('id')
        .where({ ...updatedModCapture });

      captureId = capture[0].id;

      await knex('tag').insert(tag2);
    });

    after(async () => {
      await knex('capture_tag')
        .where({ tag_id: tag2.id, capture_id: captureId })
        .del();
      await knex('tag')
        .where({ ...tag2 })
        .del();
    });

    it('should attach tag(s) to a capture', async () => {
      await request(app)
        .post(`/captures/${captureId}/tags`)
        .send({ tags: [tag2.id] })
        .expect(204);
    });

    it('should not allow duplicate attachments', async () => {
      const result = await request(app)
        .post(`/captures/${captureId}/tags`)
        .send({ tags: [tag2.id] })
        .expect(400);

      expect(result.body.code).eql(400);
      expect(result.body.message).eql(
        `Tag ${tag2.id} has already been assigned to the specified capture`,
      );
    });

    it('should get tags attached to a capture', async () => {
      const result = await request(app)
        .get(`/captures/${captureId}/tags`)
        .expect(200);
      expect(result.body.length).to.eql(1);
      expect(result.body[0]).to.include({
        capture_id: captureId,
        tag_id: tag2.id,
        tag_name: tag2.name,
        status: tag2.status,
      });
      expect(result.body[0]).to.have.keys([
        'id',
        'capture_id',
        'tag_id',
        'tag_name',
        'status',
        'created_at',
        'updated_at',
      ]);
    });

    it('should get a single tag attached to a capture', async () => {
      const result = await request(app)
        .get(`/captures/${captureId}/tags/${tag2.id}`)
        .expect(200);
      expect(result.body).to.include({
        capture_id: captureId,
        tag_id: tag2.id,
        tag_name: tag2.name,
        status: 'active',
      });
      expect(result.body).to.have.keys([
        'id',
        'capture_id',
        'tag_id',
        'tag_name',
        'status',
        'created_at',
        'updated_at',
      ]);
    });

    it('should update a single tag attached to a capture', async () => {
      const result = await request(app)
        .patch(`/captures/${captureId}/tags/${tag2.id}`)
        .send({ status: 'deleted' })
        .expect(204);
    });

    it('should get a single tag attached to a capture', async () => {
      const result = await request(app)
        .get(`/captures/${captureId}/tags/${tag2.id}`)
        .expect(200);
      expect(result.body).to.be.empty;
    });

    it('should delete a single tag attached to a capture', async () => {
      const result = await request(app)
        .delete(`/captures/${captureId}/tags/${tag2.id}`)
        .expect(204);
    });

    it('should get a single tag attached to a capture', async () => {
      const result = await request(app)
        .get(`/captures/${captureId}/tags/${tag2.id}`)
        .expect(200);
      expect(result.body).to.be.empty;
    });
  });
});
