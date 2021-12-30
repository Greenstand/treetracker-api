const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../app');
const tree2 = require('../../mock/tree2.json');
const tag2 = require('../../mock/tag2.json');
const { knex } = require('../../utils');

describe('/trees', () => {
  const treeUpdates = {
    latest_capture_id: '74b6f9fa-fa5a-4571-849c-db17ea4ef3b5',
    image_url: 'http://lru_image.com',
    species_id: '74b6f9fa-fa5a-4571-849c-db17ea4ef3b5',
    morphology: 'ygolohprom',
    age: 44,
    status: 'deleted',
  };

  const modTree = { ...tree2, attributes: { entries: tree2.attributes } };

  const updatedModTree = { ...modTree, ...treeUpdates };
  after(async () => {
    await knex('tree')
      .where({ ...updatedModTree })
      .del();
  });

  describe('POST', () => {
    it('should create a tree', async () => {
      await request(app)
        .post(`/trees`)
        .send(tree2)
        .set('Accept', 'application/json')
        .expect(204);

      // test to see if an event is being emitted
    });
  });

  describe('PATCH', () => {
    it('should uodate a tree', async () => {
      const treeId = await knex('tree')
        .select('id')
        .where({ ...modTree });
      await request(app)
        .patch(`/trees/${treeId[0].id}`)
        .send(treeUpdates)
        .set('Accept', 'application/json')
        .expect(204);
    });
  });

  describe('GET', () => {
    it('should get a single tree', async () => {
      const copy = { ...updatedModTree };
      const treeId = await knex('tree')
        .select('id')
        .where({ ...copy });
      const result = await request(app)
        .get(`/trees/${treeId[0].id}`)
        .expect(200);
      expect(result.body.attributes.entries).to.eql(copy.attributes.entries);
      delete copy.attributes;
      expect(result.body).to.include({ ...copy });
    });

    it('should get trees', async () => {
      const result = await request(app).get(`/trees`).expect(200);
      const copy = { ...updatedModTree };
      expect(result.body.length).to.eql(1);
      expect(result.body[0].attributes.entries).to.eql(copy.attributes.entries);
      delete copy.attributes;
      expect(result.body[0]).to.include({ ...copy });
    });
  });

  describe('/trees/tree_id/tags', () => {
    let treeId;

    before(async () => {
      const tree = await knex('tree')
        .select('id')
        .where({ ...updatedModTree });

      treeId = tree[0].id;

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

    it('should update a single tag attached to a tree', async () => {
      const result = await request(app)
        .patch(`/trees/${treeId}/tags/${tag2.id}`)
        .send({ status: 'deleted' })
        .expect(204);
    });

    it('should get a single tag attached to a tree', async () => {
      const result = await request(app)
        .get(`/trees/${treeId}/tags/${tag2.id}`)
        .expect(200);
      expect(result.body).to.include({
        tree_id: treeId,
        tag_id: tag2.id,
        tag_name: tag2.name,
        status: 'deleted',
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

    it('should delete a single tag attached to a tree', async () => {
      const result = await request(app)
        .delete(`/trees/${treeId}/tags/${tag2.id}`)
        .expect(204);
    });

    it('should get a single tag attached to a tree', async () => {
      const result = await request(app)
        .get(`/trees/${treeId}/tags/${tag2.id}`)
        .expect(200);
      expect(result.body).to.be.empty;
    });
  });
});
