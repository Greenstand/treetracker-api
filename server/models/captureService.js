const { knex: db } = require('../database/knex');
const { v4: uuidv4 } = require('uuid');

// DATABASE QUERIES

async function getCaptures(req, res) {
  db.from('treetracker.capture')
    .select('*')
    .then((data) => {
      console.log('data', data);
      res.status(200).json({ captures: data });
    })
    .catch((error) => console.log(error));
}

async function postCapture(req, res) {
  const requiredProps = [
    'reference_id',
    'image_url',
    'estimated_geometric_location',
    'lat',
    'lon',
    'user_id',
    'username',
    'status',
  ];
  //TODO: Any other data to require --- tree_id? planting_organization_id? species_id? morphology? age? note? attributes?
  const {
    reference_id,
    image_url,
    estimated_geometric_location,
    lat,
    lon,
    user_id,
    user_photo_url,
    username,
    status,
  } = req.body;

  // validate incoming data is all there
  for (let prop of requiredProps) {
    if (req.body[prop] === undefined) {
      res.status(400).send({
        message: `Missing required value: ${prop}`,
      });
    }
  }

  //TODO: What validations are needed?
  //check image_url and user_photo_url are urls
  //check username is a strings
  //check lat,lon are numbers
  //check id is a uuid, or assign it an id here when posted?
  //what is reference_id? a user-friendly number?
  //what should status be?

  const newCapture = {
    id: uuidv4(),
    reference_id,
    image_url,
    estimated_geometric_location,
    lat,
    lon,
    planter_id: user_id,
    planter_photo_url: user_photo_url,
    planter_username: username,
    status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // insert capture into db
  db.insert(newCapture)
    .into('treetracker.capture')
    .returning(['id'])
    .catch((error) => console.log(error));

  res.sendStatus(201);
}

async function getCaptureById(req, res) {
  const { capture_id } = req.params;
  db.from('treetracker.capture')
    .select('*')
    .where('id', capture_id)
    .then((data) => {
      res.status(200).send({ data });
    });
}

module.exports = {
  getCaptures,
  postCapture,
  getCaptureById,
};
