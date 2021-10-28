const express = require('express');

const router = express.Router();
const validateRequest = (req, res, next) => {
  next();
};
const {
  captureHandlerPost,
  captureHandlerGet,
  captureHandlerPatch,
} = require('./handlers/captureHandler.js');
const {
  treeHandlerPost,
  treeHandlerGet,
  treeHandlerGetPotentialMatches,
} = require('./handlers/treeHandler.js');

router.post('/captures', validateRequest, captureHandlerPost);
router.get('/captures', validateRequest, captureHandlerGet);
router.patch('/captures/:capture_id', validateRequest, captureHandlerPatch);

router.get('/trees/potential_matches', validateRequest, treeHandlerGetPotentialMatches);
router.post('/trees', validateRequest, treeHandlerPost);
router.get('/trees', validateRequest, treeHandlerGet);

module.exports = router;
