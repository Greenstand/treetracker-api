const captures = require('./data/Captures-1.json');

exports.seed = function (knex) {
  // // Deletes ALL existing entries
  // return (
  //   knex('capture')
  //     // .del()
  //     .then(function () {
  // // Inserts seed entries
  return knex('capture').insert(captures);
  //     })
  // );
};

/* EXAMPLE DATA */

// [
//   {
//     id: '6ab19f5c-931b-497c-887b-6da6a6572382',
//     reference_id: 1, // same as id? but set as integer not null
//     tree_id: null,
//     image_url:
//       'https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2021.03.17.23.33.54_8.43099064_-13.20422315_de873a43-c21a-40f8-adea-dfc58ef60468_IMG_20210311_123611_1990079067.jpg',
//     lat: 8.434773333333334,
//     lon: -13.201911666666668,
//     estimated_geographic_location: 'POINT (-13.208441666666666 8.430865)',
//     estimated_geometric_location:
//       'SRID=4326;POINT (-13.208441666666666 8.430865)',
//     gps_accuracy: null,
//     grower_id: '85fff895-33c8-4d89-a9b9-60b722beab60',
//     grower_photo_url: null,
//     grower_username: 'enexfy0',
//     planting_organization_id: 'b972cb35-17ba-4c0a-8a63-7487f70d2a26',
//     device_configuration_id: 'ef01ef97-55a2-4474-9c25-821fe9c5917c', // NOT NULL
//     species_id: null,
//     morphology: null,
//     age: null,
//     note: null,
//     attributes: null,
//     domain_specific_data: null,
//     status: 'active', // active/deleted NOT NULL
//     created_at: '1/14/2022',
//     updated_at: '1/22/2022',
//     session_id: '6ab19f5c-931b-497c-887b-6da6a6572382', // NOT NULL
//   },
// ];
