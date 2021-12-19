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
const { groundUserHandlerGet } = require('./handlers/groundUserHandler.js');
const {
  growerAccountHandlerGet,
  growerAccountHandlerPost,
  growerAccountHandlerPatch,
} = require('./handlers/growerAccountHandler');

router
  .route('/trees')
  .get(validateRequest, handlerWrapper(treeHandlerGet))
  .post(validateRequest, handlerWrapper(treeHandlerPost));

// Legacy
router
  .route('/ground_users')
  .get(validateRequest, handlerWrapper(groundUserHandlerGet));

router
  .route('/grower_accounts')
  .get(validateRequest, handlerWrapper(growerAccountHandlerGet))
  .post(validateRequest, handlerWrapper(growerAccountHandlerPost))
  .patch(validateRequest, handlerWrapper(growerAccountHandlerPatch));

router
  .route('/')
  .get(validateRequest, handlerWrapper(captureHandlerGet))
  .post(validateRequest, handlerWrapper(captureHandlerPost));

router
  .route('/:capture_id')
  .patch(validateRequest, handlerWrapper(captureHandlerPatch));

router
  .route('/:capture_id/potential_matches')
  .get(validateRequest, handlerWrapper(treeHandlerGetPotentialMatches));

module.exports = router;
