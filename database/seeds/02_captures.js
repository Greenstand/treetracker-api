const uuid = require('uuid');
const captures = require('./data/20220210-Captures.json');

exports.seed = function (knex) {
  // takes the ~ 20,000 captures and splits them into batches of 1000 for seeding
  const batches = [];
  for (let i = 0; i < captures.length; i += 1000) {
    const batch = captures.slice(i, i + 1000);
    batches.push(batch);
  }

  return Promise.all(
    batches.map((batch) => {
      // add session_id and device_configuration_id to each
      for (let i = 0; i < batch.length; i += 1) {
        const item = batch[i];
        item.session_id = uuid.v4();
        item.device_configuration_id = uuid.v4();
      }

      // console.log(i, batch.length)
      return knex('capture').insert(batch);
    }),
  );
};

/* EXAMPLE DATA */

// [
//   {
//     id: '6ab19f5c-931b-497c-887b-6da6a6572382',
//     reference_id: 1, // -------- references original integer tree id
//     tree_id: null,
//     image_url:
//       'https://treetracker-production-images.s3.eu-central-1.amazonaws.com/some.jpg',
//     lat: 8.434773333333334,
//     lon: -13.201911666666668,
//     estimated_geographic_location: 'POINT (-13.208441666666666 8.430865)',
//     estimated_geometric_location: // -------- add 'SRID=4326;' to the front of the geographic_location,
//     gps_accuracy: null,
//     grower_id: '85fff895-33c8-4d89-a9b9-60b722beab60',
//     grower_photo_url: null,
//     grower_username: 'enexfy0',
//     planting_organization_id: 'b972cb35-17ba-4c0a-8a63-7487f70d2a26',
//     device_configuration_id: // -------- NOT NULL
//     species_id: null,
//     morphology: null,
//     age: null,
//     note: null,
//     attributes: null,
//     domain_specific_data: null,
//     status: 'active', // -------- active/deleted,  NOT NULL
//     captured_at: '1/14/2022',
//     created_at: '1/14/2022',
//     updated_at: '1/22/2022',
//     session_id:  // -------- NOT NULL
//   },
// ];

// DELETE FROM treetracker.capture
// WHERE session_id is null ;
