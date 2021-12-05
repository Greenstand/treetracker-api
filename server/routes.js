const express = require('express');

const router = express.Router();
const validateRequest = (req, res, next) => {
  next();
};
const { handlerWrapper } = require('./handlers/utils');
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
const { planterHandlerGet } = require('./handlers/planterHandler.js');


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

router.get('/planters', handlerWrapper(planterHandlerGet));

module.exports = router;
