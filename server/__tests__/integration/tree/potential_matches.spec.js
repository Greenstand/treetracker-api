const request = require("supertest");
const app = require("../../../app");
const { expect } = require('chai');
const log = require("loglevel");
const utils = require("../../utils");
const tree1 = require("../../mock/tree1.json");
const tree2 = require("../../mock/tree2.json");
const capture1 = require("../../mock/capture1.json");

describe("GET /trees/potential_matches", () => {
  beforeEach(async () => {
    await utils.delTree(tree1.id);
    await utils.delTree(tree2.id);
    await utils.delCapture(capture1.id);
  });

  it("match 1 result", async () => {
    await utils.addTree(tree1);
    await utils.addTree(tree2);
    await utils.addCapture(capture1);
    const response = await request(app).get("/trees/potential_matches");
//    log.warn("response:", response);
    expect(response.body)
      .to.have.property("matches")
      .to.have.lengthOf(1);
  });

});
