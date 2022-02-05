const growers = require('./data/Grower_Accounts-1.json');

exports.seed = function (knex) {
  // return knex('grower_account')
  //   .del()
  // .then(function () {
  // Inserts seed entries
  return knex('grower_account').insert(growers);
  // });
};
