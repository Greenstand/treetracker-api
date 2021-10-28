const request = require("supertest");
const app = require("../../../app");
const { expect } = require('chai');
const log = require("loglevel");
const utils = require("../../utils");
const tree1 = require("../../mock/tree1.json");
const tree2 = require("../../mock/tree2.json");
const capture1 = require("../../mock/capture1.json");
const capture2 = require("../../mock/capture2.json");
const uuid = require("uuid");

describe("GET /trees/potential_matches", () => {
  beforeEach(async () => {
    await utils.delTree(tree1.id);
    await utils.delTree(tree2.id);
    await utils.delCapture(capture1.id);
    await utils.delCapture(capture2.id);
  });

  it("tree1 potential matches capture1", async () => {
    await utils.addTree({
      ...tree1,
      latest_capture_id: uuid.v1(),
    });
    await utils.addCapture({
      ...capture1,
    });
    const response = await request(app).get(`/trees/potential_matches?capture_id=${capture1.id}`);
    expect(response.body)
      .to.have.property("matches");
    expect(response.body.matches.map(m => m.id))
      .to.have.members([tree1.id]);
  });

  it("tree1 doesn't potential matches capture1 because it already attached by capture1", async () => {
    await utils.addTree({
      ...tree1,
      latest_capture_id: uuid.v1(),
    });
    await utils.addCapture({
      ...capture1,
      tree_id: tree1.id,
    });
    const response = await request(app).get(`/trees/potential_matches?capture_id=${capture1.id}`);
    expect(response.body)
      .to.have.property("matches");
    expect(response.body.matches.map(m => m.id))
      .to.not.have.members([tree1.id]);
  });

  it("tree1 doesn't potential matches capture1 because it's too far away with c1", async () => {
    await utils.addTree({
      ...tree1,
      location: "POINT(179 70)",
      latest_capture_id: uuid.v1(),
    });
    await utils.addCapture({
      ...capture1,
    });
    const response = await request(app).get(`/trees/potential_matches?capture_id=${capture1.id}`);
    expect(response.body)
      .to.have.property("matches");
    expect(response.body.matches.map(m => m.id))
      .to.not.have.members([tree1.id]);
  });

});
