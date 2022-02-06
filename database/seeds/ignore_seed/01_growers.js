const growers = require('../data/20220130-Growers.json');

exports.seed = function (knex) {
  // return knex('grower_account')
  //   .del()
  // .then(function () {
  // Inserts seed entries
  return knex('grower_account').insert(growers);
  // });
};
