const uuid = require('uuid');
const captures = require('./data/20220210-Captures.json');

exports.seed = function (knex) {
  // takes the ~ 20,000 captures and splits them into batches of 1000 for seeding
  const batches = [];
  for (let i = 0; i < captures.length; i += 1000) {
    const batch = captures.slice(i, i + 1000);
    batches.push(batch);
  }

  return knex('capture')
    .del()
    .then(function () {
      return Promise.all(
        batches.map((batch, index) => {
          // add session_id and device_configuration_id to each
          for (let i = 0; i < batch.length; i += 1) {
            const item = batch[i];
            item.session_id = uuid.v4();
            item.device_configuration_id = uuid.v4();
          }

          console.log(index, batch.length);

          // Inserts seed entries
          return knex('capture').insert(batch);
        }),
      );
    });
};
