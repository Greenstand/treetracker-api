const request = require('supertest');
const { expect } = require('chai');
const uuid = require('uuid');
const app = require('../../../app');
const utils = require('../../utils');
const tree1 = require('../../mock/tree1.json');
const capture1 = require('../../mock/capture1.json');
const grower_account1 = require('../../mock/grower_account1.json');

describe('GET /trees/potential_matches', () => {
  const { knex } = utils;
  before(async () => {
    const growerAccount1 = await knex('grower_account')
      .insert({
        ...grower_account1,
      })
      .returning('id');

    const [captureGrowerAccountId] = growerAccount1;
    capture1.grower_account_id = captureGrowerAccountId;
  });

  afterEach(async () => {
    await utils.delTree(tree1.id);
    await utils.delCapture(capture1.id);
  });

  after(async () => {
    await knex('grower_account').del();
  });

  const extraInfo = {
    created_at: '2021-05-04 11:24:43',
    updated_at: '2021-05-04 11:24:43',
    estimated_geometric_location: 'POINT(50 50)',
    estimated_geographic_location: 'POINT(50 50)',
    latest_capture_id: uuid.v4(),
  };

  it('tree1 potential matches capture1', async () => {
    await utils.addTree({
      ...tree1,
      attributes: { entries: tree1.attributes },
      ...extraInfo,
    });
    await utils.addCapture({
      ...capture1,
      estimated_geometric_location: 'POINT(50 50)',
      estimated_geographic_location: 'POINT(50 50)',
      updated_at: '2021-05-04 11:24:43',
    });
    const response = await request(app).get(
      `/trees/potential_matches?capture_id=${capture1.id}`,
    );
    expect(response.body).to.have.property('matches');
    //    expect(response.body.matches[0].id).eq(1);
    expect(response.body.matches.map((m) => m.id)).to.have.members([tree1.id]);
  });

  it("tree1 doesn't potential matches capture1 because it already attached by capture1", async () => {
    await utils.addTree({
      ...tree1,
      attributes: { entries: tree1.attributes },
      ...extraInfo,
    });
    await utils.addCapture({
      ...capture1,
      tree_id: tree1.id,
      estimated_geometric_location: 'POINT(50 50)',
      updated_at: '2021-05-04 11:24:43',
    });
    const response = await request(app).get(
      `/trees/potential_matches?capture_id=${capture1.id}`,
    );
    expect(response.body).to.have.property('matches');
    expect(response.body.matches.map((m) => m.id)).to.not.have.members([
      tree1.id,
    ]);
  });

  it("tree1 doesn't potential matches capture1 because it's too far away from c1", async () => {
    await utils.addTree({
      ...tree1,
      ...extraInfo,
      estimated_geometric_location: 'POINT(179 70)',
      attributes: { entries: tree1.attributes },
    });
    await utils.addCapture({
      ...capture1,
      estimated_geometric_location: 'POINT(50 50)',
      updated_at: '2021-05-04 11:24:43',
    });
    const response = await request(app).get(
      `/trees/potential_matches?capture_id=${capture1.id}`,
    );
    expect(response.body).to.have.property('matches');
    expect(response.body.matches.map((m) => m.id)).to.not.have.members([
      tree1.id,
    ]);
  });
});
