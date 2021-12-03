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

router.post('/captures', validateRequest, handlerWrapper(captureHandlerPost));
router.get('/captures', validateRequest, handlerWrapper(captureHandlerGet));
router.patch(
  '/captures/:capture_id',
  validateRequest,
  handlerWrapper(captureHandlerPatch),
);

router.post('/trees', validateRequest, handlerWrapper(treeHandlerPost));
router.get('/trees', validateRequest, handlerWrapper(treeHandlerGet));
router.get(
  '/trees/potential_matches',
  validateRequest,
  handlerWrapper(treeHandlerGetPotentialMatches),
);

router.get('/planters', handlerWrapper(planterHandlerGet));

module.exports = router;
