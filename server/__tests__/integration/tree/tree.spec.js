const request = require('supertest');
const { expect } = require('chai');
const uuid = require('uuid');
const app = require('../../../app');
const tree2 = require('../../mock/tree2.json');
const tree1 = require('../../mock/tree1.json');
const domain_event1 = require('../../mock/domain_event1.json');
const tag2 = require('../../mock/tag2.json');
const { knex, addTree, delTree } = require('../../utils');

describe('/trees', () => {
  const treeUpdates = {
    latest_capture_id: '74b6f9fa-fa5a-4571-849c-db17ea4ef3b5',
    image_url: 'http://lru_image.com',
    species_id: '74b6f9fa-fa5a-4571-849c-db17ea4ef3b5',
    morphology: 'ygolohprom',
    age: 44,
  };

  const modTree = { ...tree2, attributes: { entries: tree2.attributes } };

  const updatedModTree = { ...modTree, ...treeUpdates };
  after(async () => {
    await knex('tree').del();
  });

  describe('POST', () => {
    before(async () => {
      await addTree({
        ...tree1,
        created_at: '2021-05-04 11:24:43',
        updated_at: '2021-05-04 11:24:43',
        estimated_geometric_location: 'POINT(50 50)',
        latest_capture_id: uuid.v4(),
        attributes: { entries: tree1.attributes },
      });
      await knex('domain_event').insert({ ...domain_event1 });
    });

    it('should create a tree', async () => {
      await request(app)
        .post(`/trees`)
        .send(tree2)
        .set('Accept', 'application/json')
        .expect(204);
    });

    it('should not error out when duplicate data is sent', async () => {
      await request(app)
        .post(`/trees`)
        .send(tree2)
        .set('Accept', 'application/json')
        .expect(204);
    });

    it('should resend tree created event if it wasnt successful last time and tree already exists', async () => {
      await request(app)
        .post(`/trees`)
        .send({ ...tree2, id: tree1.id })
        .set('Accept', 'application/json')
        .expect(204);

      // added a timer to confirm this because the function call in the API is not 'awaited'
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const numOfEmittedEvents = await knex('domain_event')
        .count()
        .where({ status: 'sent' });
      expect(+numOfEmittedEvents[0].count).to.eql(2);
    });

    after(async () => {
      await delTree(tree1.id);
      await knex('domain_event').del();
    });
  });

  describe('PATCH', () => {
    it('should uodate a tree', async () => {
      await request(app)
        .patch(`/trees/${tree2.id}`)
        .send(treeUpdates)
        .set('Accept', 'application/json')
        .expect(204);

      const copy = { ...updatedModTree };
      const result = await request(app).get(`/trees/${tree2.id}`).expect(200);
      expect(result.body.attributes.entries).to.eql(copy.attributes.entries);
      delete copy.attributes;
      expect(result.body).to.include({ ...copy });
    });
  });

  describe('GET', () => {
    it('should get trees', async () => {
      const result = await request(app).get(`/trees`).expect(200);
      const copy = { ...updatedModTree };
      expect(result.body.length).to.eql(1);
      expect(result.body[0].attributes.entries).to.eql(copy.attributes.entries);
      delete copy.attributes;
      expect(result.body[0]).to.include({ ...copy });
    });

    it('should delete a tree', async () => {
      await request(app)
        .patch(`/trees/${tree2.id}`)
        .send({ status: 'deleted' })
        .set('Accept', 'application/json')
        .expect(204);

      const result = await request(app).get(`/trees`).expect(200);
      expect(result.body.length).to.eql(0);
    });
  });

  describe('/trees/tree_id/tags', () => {
    const treeId = tree2.id;

    before(async () => {
      await knex('tag').insert(tag2);
    });

    after(async () => {
      await knex('tree_tag').where({ tag_id: tag2.id, tree_id: treeId }).del();
      await knex('tag')
        .where({ ...tag2 })
        .del();
    });

    it('should attach tag(s) to a tree', async () => {
      await request(app)
        .post(`/trees/${treeId}/tags`)
        .send({ tags: [tag2.id] })
        .expect(204);
    });

    it('should not allow duplicate attachments', async () => {
      const result = await request(app)
        .post(`/trees/${treeId}/tags`)
        .send({ tags: [tag2.id] })
        .expect(400);

      expect(result.body.code).eql(400);
      expect(result.body.message).eql(
        `Tag ${tag2.id} has already been assigned to the specified tree`,
      );
    });

    it('should get tags attached to a tree', async () => {
      const result = await request(app)
        .get(`/trees/${treeId}/tags`)
        .expect(200);
      expect(result.body.length).to.eql(1);
      expect(result.body[0]).to.include({
        tree_id: treeId,
        tag_id: tag2.id,
        tag_name: tag2.name,
        status: tag2.status,
      });
      expect(result.body[0]).to.have.keys([
        'id',
        'tree_id',
        'tag_id',
        'tag_name',
        'status',
        'created_at',
        'updated_at',
      ]);
    });

    it('should delete a single tag attached to a tree', async () => {
      await request(app).delete(`/trees/${treeId}/tags/${tag2.id}`).expect(204);

      const result = await request(app)
        .get(`/trees/${treeId}/tags/${tag2.id}`)
        .expect(200);
      expect(result.body).to.be.empty;
    });

    it('should update a single tag attached to a tree', async () => {
      await request(app)
        .patch(`/trees/${treeId}/tags/${tag2.id}`)
        .send({ status: 'active' })
        .expect(204);

      const result = await request(app)
        .get(`/trees/${treeId}/tags/${tag2.id}`)
        .expect(200);
      expect(result.body).to.include({
        tree_id: treeId,
        tag_id: tag2.id,
        tag_name: tag2.name,
        status: 'active',
      });

      expect(result.body).to.have.keys([
        'id',
        'tree_id',
        'tag_id',
        'tag_name',
        'status',
        'created_at',
        'updated_at',
      ]);
    });
  });
});
