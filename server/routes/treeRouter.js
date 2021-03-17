const express = require('express');
const treeRouter = express.Router();
const helper = require('./utils');
const db = require('../database');

treeRouter.get(
  '/potential_matches',
  helper.handlerWrapper(async (req, res) => {
    const id = req.query.capture_id;
    //maximum distance in meters between possible matches and tree in query
    const distance = 6;
    const query =
      'SELECT id, image_url as "imageUrl", lat, lon, species_id as "speciesId", morphology, age, status, time_created as "createdAt", time_updated as "updatedAt" FROM trees WHERE ST_DWithin(estimated_geometric_location::geography, (SELECT estimated_geometric_location FROM trees WHERE id=$1)::geography, $2)';
    const result = await db.query(query, [id, distance]);
    const data = result.filter((item) => item.id != id);

    res.status(200).json(data);
  }),
);

module.exports = treeRouter;
