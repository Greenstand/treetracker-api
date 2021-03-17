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
      'SELECT id, image_url as "imageUrl", latest_capture_id as "latestCaptureId", lat, lon, species_id as "speciesId", morphology, age, status, created_at as "createdAt", updated_at as "updatedAt" FROM treetracker.tree WHERE ST_DWithin(estimated_geographic_location, (SELECT estimated_geographic_location FROM treetracker.capture WHERE id=$1), $2)';
    const result = await db.query(query, [id, distance]);
    const data = result.filter((item) => item.id != id);

    res.status(200).json(data);
  }),
);

module.exports = treeRouter;
