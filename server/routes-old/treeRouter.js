const express = require('express');
const treeRouter = express.Router();
const db = require('../infra/database/knex').knex;

treeRouter.get(
  '/potential_matches',
  (async (req, res) => {
    const id = req.query.capture_id || "2f69b241-f4f5-4b13-a35c-72bc4b5ea192";
    //maximum distance in meters between possible matches and tree in query
    const distance = req.query.distance || 6;
    const query =
      'SELECT t1.id, t1.image_url, t1.latest_capture_id, t1.lat, t1.lon, t1.species_id, t1.morphology, t1.age, t1.status, t1.created_at, t1.updated_at FROM treetracker.tree t1 LEFT JOIN treetracker.capture t2 ON ST_DWithin(t1.location, t2.location, :distance) WHERE t1.id= :id AND t2.id<> :id';
    const data = await db.raw(query, {id, distance});

    res.status(200).json({matches: data.rows});
  }),
);

module.exports = treeRouter;
