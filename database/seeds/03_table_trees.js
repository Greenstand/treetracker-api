const trees = require('./data/20220210-Trees.json');

exports.seed = function (knex) {
  return knex('tree')
    .del()
    .then(function () {
      return knex('tree').insert(trees);
    });
};
