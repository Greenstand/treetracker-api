const growers = require('./data/20220130-Growers.json');
const knex = require('../connection');

const parsePoint = (json) => {
  const jsonCopy = { ...json };
  if (jsonCopy.lat && jsonCopy.lon) {
    jsonCopy.location = knex.raw(
      `ST_PointFromText('POINT(${jsonCopy.lon} ${jsonCopy.lat})', 4326)`,
    );
  }
  return jsonCopy;
};

exports.seed = function (knex) {
  return knex('grower_account').insert(growers.map((g) => parsePoint(g)));
};
