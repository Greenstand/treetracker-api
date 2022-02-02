const trees = require('./data/Trees-1.json');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  // return (
  //   knex('capture')
  //     // .del()
  //     .then(function () {
  //       // Inserts seed entries
  return knex('tree').insert(trees);
  //     })
  // );
};
