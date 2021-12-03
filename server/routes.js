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

router
  .route('/')
  .get(validateRequest, captureHandlerGet)
  .post(validateRequest, captureHandlerPost);

router.route('/:capture_id').patch(validateRequest, captureHandlerPatch);

router
  .route('/:capture_id/potential_matches')
  .get(validateRequest, treeHandlerGetPotentialMatches);

router
  .route('/trees')
  .get(validateRequest, treeHandlerGet)
  .post(validateRequest, treeHandlerPost);

module.exports = router;
