const {knex} = require("../infra/database/knex");

function parsePoint(json){
  for(const key in json){
    if(json[key].match && json[key].match(/^POINT\(.*\)$/)){
      json[key] = knex.raw(`ST_PointFromText('${json[key]}', 4326)`);
    }
  }
  console.error("j:", json);
  return json;
}

module.exports = {
  async addTree(json){
    await knex("treetracker.tree").insert(parsePoint(json)).returning("*");
  },
  async addCapture(json){
    await knex("treetracker.capture").insert(parsePoint(json)).returning("*");
  },
  async delTree(id){
    await knex("treetracker.tree").where("id", id).del();
  },
  async delCapture(id){
    await knex("treetracker.capture").where("id", id).del();
  },
}
