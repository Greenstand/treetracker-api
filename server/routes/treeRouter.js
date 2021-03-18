const express = require('express');
const treeRouter = express.Router();
const helper = require('./utils');
const db = require('../database');

treeRouter.get(
  '/potential_matches',
  helper.handlerWrapper(async (req, res) => {
    const id = req.query.capture_id;
    //maximum distance in meters between possible matches and tree in query
    const distance = req.query.distance || 6;
    const query =
      'SELECT id, image_url as "imageUrl", latest_capture_id as "latestCaptureId", lat, lon, species_id as "speciesId", morphology, age, status, created_at as "createdAt", updated_at as "updatedAt" FROM treetracker.tree t1 LEFT JOIN treetracker.capture t2 ON ST_DWithin(t1.estimated_geographic_location, t2.estimated_geographic_location, $2) WHERE t1.id=$1 AND t2.id<>$1';
    const data = await db.query(query, [id, distance]);

    res.status(200).json(data);
  }),
);

module.exports = treeRouter;
