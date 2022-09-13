require('dotenv').config();
require('../../setup');
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const uuid = require('uuid');
const LegacyAPI = require('../../../server/services/LegacyAPIService');
const app = require('../../../server/app');
const capture2 = require('../../mock/capture2.json');
const capture1 = require('../../mock/capture1.json');
const attributes = require('../../mock/attributes.json');
const tag2 = require('../../mock/tag2.json');
const grower_account1 = require('../../mock/grower_account1.json');
const grower_account2 = require('../../mock/grower_account2.json');
const domain_event2 = require('../../mock/domain_event2.json');
const tree1 = require('../../mock/tree1.json');
const { knex, addCapture, addTree } = require('../../utils');

describe('/captures', () => {
  before(async () => {
    const growerAccount1 = await knex('grower_account')
      .insert({
        ...grower_account1,
        status: 'active',
      })
      .returning('id');
    const growerAccount2 = await knex('grower_account')
      .insert({
        ...grower_account2,
        status: 'active',
      })
      .returning('id');
    const [savedTree1] = await addTree({
      ...tree1,
      created_at: '2021-05-04 11:24:43',
      updated_at: '2021-05-04 11:24:43',
      estimated_geometric_location: 'POINT(50 50)',
      latest_capture_id: uuid.v4(),
      attributes: { entries: tree1.attributes },
    });
    const [capture1GrowerAccountId] = growerAccount1;
    const [capture2GrowerAccountId] = growerAccount2;
    capture1.grower_account_id = capture1GrowerAccountId;
    capture1.tree_id = savedTree1.id;
    capture2.grower_account_id = capture2GrowerAccountId;
  });

  after(async () => {
    await knex('capture_tag').del();
    await knex('tag').del();
    await knex('capture').del();
    await knex('grower_account').del();
    await knex('tree').del();
  });

  describe('POST', () => {
    const legacyExtraObjects = {
      capture_approval_tag: 'approved',
      species_id_int: 12,
      organization_id: 11,
    };
    let legacyAPIApproveTreeStub;

    beforeEach(async () => {
      legacyAPIApproveTreeStub = sinon
        .stub(LegacyAPI, 'approveLegacyTree')
        .resolves();
    });

    afterEach(async () => {
      legacyAPIApproveTreeStub.restore();
    });

    before(async () => {
      await addCapture({
        ...capture1,
        estimated_geometric_location: 'POINT(50 50)',
        updated_at: '2022-02-01 11:11:11',
      });
      await knex('domain_event').insert({ ...domain_event2 });
    });

    after(async () => {
      await knex('capture').del();
      await knex('domain_event').del();
    });

    it('should create a capture', async () => {
      const res = await request(app)
        .post(`/captures`)
        .send({
          ...capture2,
          ...legacyExtraObjects,
        })
        .set('Accept', 'application/json')
        .set('Authorization', 'jwt_token')
        .expect(201);

      expect(
        legacyAPIApproveTreeStub.calledOnceWithExactly({
          id: capture2.reference_id,
          speciesId: legacyExtraObjects.species_id_int,
          morphology: capture2.morphology,
          age: `${capture2.age}`,
          captureApprovalTag: legacyExtraObjects.capture_approval_tag,
          legacyAPIAuthorizationHeader: 'jwt_token',
          organizationId: legacyExtraObjects.organization_id,
        }),
      ).eql(true);

      expect(res.body).to.include({
        image_url: capture2.image_url,
        planting_organization_id: capture2.planting_organization_id,
        lat: capture2.lat,
        lon: capture2.lon,
        tree_associated: false,
        captured_at: new Date(capture2.captured_at).toISOString(),
      });
    });

    it('should not error out when duplicate data is sent', async () => {
      const res = await request(app)
        .post(`/captures`)
        .send({
          ...capture2,
          ...legacyExtraObjects,
        })
        .set('Accept', 'application/json')
        .set('Authorization', 'jwt_token')
        .expect(200);

      expect(
        legacyAPIApproveTreeStub.calledOnceWithExactly({
          morphology: capture2.morphology,
          age: `${capture2.age}`,
          captureApprovalTag: legacyExtraObjects.capture_approval_tag,
          speciesId: legacyExtraObjects.species_id_int,
          id: capture2.reference_id,
          legacyAPIAuthorizationHeader: 'jwt_token',
          organizationId: legacyExtraObjects.organization_id,
        }),
      ).eql(true);

      expect(res.body).to.include({
        image_url: capture2.image_url,
        planting_organization_id: capture2.planting_organization_id,
        lat: capture2.lat,
        lon: capture2.lon,
        tree_associated: false,
        captured_at: new Date(capture2.captured_at).toISOString(),
      });
    });

    it('should resend capture created event if it wasnt successful last time and capture already exists', async () => {
      await request(app)
        .post(`/captures`)
        .send({
          ...capture2,
          ...legacyExtraObjects,
          id: capture1.id,
        })
        .set('Accept', 'application/json')
        .set('Authorization', 'jwt_token')
        .expect(200);

      expect(
        legacyAPIApproveTreeStub.calledOnceWithExactly({
          morphology: capture2.morphology,
          age: `${capture2.age}`,
          captureApprovalTag: legacyExtraObjects.capture_approval_tag,
          speciesId: legacyExtraObjects.species_id_int,
          id: capture2.reference_id,
          legacyAPIAuthorizationHeader: 'jwt_token',
          organizationId: legacyExtraObjects.organization_id,
        }),
      ).eql(true);

      // added a timer to confirm this because the function call in the API is a callback function not 'awaited'
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const numOfEmittedEvents = await knex('domain_event')
        .count()
        .where({ status: 'sent' });
      expect(+numOfEmittedEvents[0].count).to.eql(2);
    });
  });

  describe('PATCH', () => {
    const captureId = uuid.v4();
    before(async () => {
      await addCapture({
        ...capture2,
        id: captureId,
        estimated_geometric_location: 'POINT(50 50)',
        updated_at: '2022-01-01T11:11:11.000Z',
        attributes: { entries: attributes.attributes },
      });
    });

    after(async () => {
      await knex('capture').del();
    });

    it('should update a capture', async () => {
      const updates = {
        tree_id: tree1.id,
      };

      const res = await request(app)
        .patch(`/captures/${captureId}`)
        .send(updates)
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).to.include({
        image_url: capture2.image_url,
        planting_organization_id: capture2.planting_organization_id,
        lat: capture2.lat,
        lon: capture2.lon,
        tree_associated: true,
        tree_id: updates.tree_id,
      });
    });
  });

  describe('GET', () => {
    const captureId = uuid.v4();
    before(async () => {
      await addCapture({
        ...capture1,
        estimated_geometric_location: 'POINT(50 50)',
        updated_at: '2022-02-01 11:11:11',
        attributes: { entries: attributes.attributes },
      });
      await addCapture({
        ...capture2,
        id: captureId,
        estimated_geometric_location: 'POINT(50 50)',
        updated_at: '2022-02-01 11:11:11',
        attributes: { entries: attributes.attributes },
      });
    });

    it('should get captures', async () => {
      const result = await request(app).get(`/captures`).expect(200);
      expect(result.body.captures.length).to.eql(2);
      // console.log(result.body.captures[1]);
      // expect(result.body.captures[1]).to.include({ ...capture1 });
    });

    it('should get only captures with tree associated', async () => {
      const result = await request(app)
        .get(`/captures?tree_associated=true`)
        .expect(200);
      expect(result.body.captures.length).to.eql(1);
      expect(result.body.query.count).to.eql(1);
      expect(result.body.captures[0].id).to.eql(
        'c02a5ae6-3727-11ec-8d3d-0242ac130003',
      );
    });

    it('should get only captures without tree associated', async () => {
      const result = await request(app)
        .get(`/captures?tree_associated=false`)
        .expect(200);
      expect(result.body.captures.length).to.eql(1);
      expect(result.body.query.count).to.eql(1);
      expect(result.body.captures[0].id).to.eql(captureId);
    });

    it('should delete a capture', async () => {
      await request(app)
        .patch(`/captures/${captureId}`)
        .send({ status: 'deleted' })
        .set('Accept', 'application/json')
        .expect(200);

      const result = await request(app).get(`/captures`).expect(200);
      expect(result.body.captures.length).to.eql(1);
    });

    after(async () => {
      await knex('capture').del();
    });
  });

  describe('/captures/capture_id/tags', () => {
    const captureId = uuid.v4();

    before(async () => {
      await addCapture({
        ...capture1,
        estimated_geometric_location: 'POINT(50 50)',
        updated_at: '2022-02-01 11:11:11',
      });
      await addCapture({
        ...capture2,
        id: captureId,
        estimated_geometric_location: 'POINT(50 50)',
        updated_at: '2022-02-01 11:11:11',
      });
      await knex('tag').insert(tag2);
    });

    after(async () => {
      await knex('capture_tag').del();
      await knex('tag').del();
      await knex('capture').del();
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

    it('should update a single tag attached to a capture', async () => {
      await request(app)
        .patch(`/captures/${captureId}/tags/${tag2.id}`)
        .send({ status: 'deleted' })
        .expect(200);

      await request(app)
        .get(`/captures/${captureId}/tags/${tag2.id}`)
        .expect(404);
    });
  });
});
