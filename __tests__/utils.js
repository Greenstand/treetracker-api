const knex = require('../server/infra/database/knex');

const apiKey = '7ad7227a-a9db-4920-980b-a060f9a98caa';
const apiKeyHash =
  'e7d174783fabac2c6cec839b10c36fd40fdafa70305626a8b20ed26e607dc3d98f1ad5c38399c4ef886667a29fc3858e72981a4f3f7045c7c0502013ff825041';

function parsePoint(json) {
  const jsonCopy = { ...json };
  Object.keys(jsonCopy).forEach((key) => {
    if (jsonCopy[key].match && jsonCopy[key].match(/^POINT\(.*\)$/)) {
      jsonCopy[key] = knex.raw(`ST_PointFromText('${jsonCopy[key]}', 4326)`);
    }
  });
  return jsonCopy;
}

module.exports = {
  async addTree(json) {
    return knex('tree').insert(parsePoint(json)).returning('*');
  },
  async addCapture(json) {
    return knex('capture').insert(parsePoint(json)).returning('*');
  },
  async delTree(id) {
    await knex('tree').where('id', id).del();
  },
  async delCapture(id) {
    await knex('capture').where('id', id).del();
  },
  async addApiKey() {
    await knex('api_key').insert({ key: apiKeyHash });
  },
  apiKey,
  knex,
};
