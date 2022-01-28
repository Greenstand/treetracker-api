const request = require('supertest');
require('dotenv').config();
const { expect } = require('chai');
require('../../setup');
const app = require('../../../app');
const capture2 = require('../../mock/capture2.json');
const capture1 = require('../../mock/capture1.json');
const attributes = require('../../mock/attributes.json');
const tag2 = require('../../mock/tag2.json');
const grower_account1 = require('../../mock/grower_account1.json');
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
    attributes: { entries: attributes.attributes }
  };

  const updatedModCapture = { ...modCapture, ...captureUpdates };
  before(async () => {
    await knex('grower_account').insert({
      ...grower_account1,
      status: 'active',
    });
    await knex('grower_account').insert({
      ...grower_account2,
      status: 'active',
    });
  });


  after(async () => {

    await knex('capture_tag')
      .del();

    await knex('tag')
      .del();
  
    await knex('capture')
      .del();

    await knex('grower_account')
      .del();
  });

  describe('POST', () => {
    before(async () => {
      await addCapture({
        ...capture1,
        estimated_geometric_location: 'POINT(50 50)',
        updated_at: "2022-02-01 11:11:11"
      });
      // await addCapture({
      //   ...capture2,
      //   estimated_geometric_location: 'POINT(50 50)',
      //   updated_at: "2022-02-01 11:11:11"
      // });
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
      await knex('capture').del();
      await knex('domain_event').del();
    });
  });

  describe('PATCH', () => {

    before(async () => {
      await addCapture({
        ...capture2,
        estimated_geometric_location: 'POINT(50 50)',
        updated_at: "2022-01-01T11:11:11.000Z",
        attributes: { entries:  attributes.attributes }
      });
    }); 

    it('should update a capture', async () => {
      await request(app)
        .patch(`/captures/${capture2.id}`)
        .send(captureUpdates)
        .set('Accept', 'application/json')
        .expect(204);

      const result = await request(app)
        .get(`/captures/${capture2.id}`)
        .expect(200);
      // expect(result.body.attributes.entries).to.eql(captureUpdates.attributes.entries);
      // delete copy.attributes;
      expect(result.body).to.include({ ...captureUpdates });
    });

    after(async () => {      
      await knex('capture').del();
    });
  });

  describe('GET', () => {

    before(async () => {
      await addCapture({
        ...capture1,
        estimated_geometric_location: 'POINT(50 50)',
        updated_at: "2022-02-01 11:11:11",
        attributes: { entries:  attributes.attributes }
      });
      await addCapture({
        ...capture2,
        estimated_geometric_location: 'POINT(50 50)',
        updated_at: "2022-02-01 11:11:11",
        attributes: { entries:  attributes.attributes }
      });
    });

    // TODO: do not check changes from a different test in a another test
    // this test is just to check changes from the PATCH test, they must be combined
    it.skip('should get captures', async () => {
      const result = await request(app).get(`/captures`).expect(200);
      const copy = { ...updatedModCapture };
      expect(result.body.length).to.eql(2);
      expect(result.body[1].attributes.entries).to.eql(copy.attributes.entries);
      delete copy.attributes;
      expect(result.body[1]).to.include({ ...copy });
    });

    it('should get only captures with tree associated', async () => {
      const result = await request(app).get(`/captures?tree_associated=true`).expect(200);
      expect(result.body.length).to.eql(1);
      expect(result.body[0].id).to.eql("c02a5ae6-3727-11ec-8d3d-0242ac130003");
    });

    it('should get only captures without tree associated', async () => {
      const result = await request(app).get(`/captures?tree_associated=false`).expect(200);
      expect(result.body.length).to.eql(1);
      expect(result.body[0].id).to.eql("d2c69205-b13f-4ab6-bb5e-33dc504fa0c2");
    });

    it('should delete a capture', async () => {
      await request(app)
        .patch(`/captures/${capture2.id}`)
        .send({ status: 'deleted' })
        .set('Accept', 'application/json')
        .expect(204);
      
      const result = await request(app).get(`/captures`).expect(200);
      const copy = { ...updatedModCapture };
      expect(result.body.length).to.eql(1);
    });

    after(async () => {      
      const result = await knex('capture').del();
    });
  });


  describe('/captures/capture_id/tags', () => {
    const captureId = capture2.id;

    before(async () => {
      await addCapture({
        ...capture1,
        estimated_geometric_location: 'POINT(50 50)',
        updated_at: "2022-02-01 11:11:11"
      });
      await addCapture({
        ...capture2,
        estimated_geometric_location: 'POINT(50 50)',
        updated_at: "2022-02-01 11:11:11"
      });
      await knex('tag').insert(tag2);
    });

    after(async () => {
      await knex('capture_tag')
        .del();
      await knex('tag')
        .del();
      await knex('capture')
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
