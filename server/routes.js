const express = require('express');

const router = express.Router();
const validateRequest = (req, res, next) => {
  next();
};
const { handlerWrapper } = require('./utils/utils');
const {
  captureHandlerPost,
  captureHandlerGet,
  captureHandlerPatch,
  captureHandlerSingleGet,
  captureHanglerTagGet,
  captureHandlerTagPost,
  captureHandlerSingleTagGet,
  captureHandlerSingleTagPatch,
} = require('./handlers/captureHandler');
const {
  treeHandlerPost,
  treeHandlerGet,
  treeHandlerGetPotentialMatches,
  treeHandlerSingleGet,
  treeHandlerPatch,
  treeHandlerTagGet,
  treeHandlerTagPost,
  treeHandlerSingleTagGet,
  treeHandlerSingleTagPatch,
} = require('./handlers/treeHandler');
const {
  growerAccountHandlerGet,
  growerAccountHandlerPost,
  growerAccountHandlerPatch,
  growerAccountHandlerSingleGet,
  growerAccountHandlerPut,
} = require('./handlers/growerAccountHandler');
const {
  tagHandlerGet,
  tagHandlerPost,
  tagHandlerSingleGet,
  tagHandlerPatch,
} = require('./handlers/tagHandler');

router
  .route('/trees')
  .get(validateRequest, handlerWrapper(treeHandlerGet))
  .post(validateRequest, handlerWrapper(treeHandlerPost));

router
  .route('/trees/potential_matches')
  .get(validateRequest, handlerWrapper(treeHandlerGetPotentialMatches));

router
  .route('/trees/:tree_id')
  .get(validateRequest, handlerWrapper(treeHandlerSingleGet))
  .patch(validateRequest, handlerWrapper(treeHandlerPatch));

router
  .route('/trees/:tree_id/tags')
  .get(validateRequest, handlerWrapper(treeHandlerTagGet))
  .post(validateRequest, handlerWrapper(treeHandlerTagPost));

router
  .route('/trees/:tree_id/tags/:tag_id')
  .get(validateRequest, handlerWrapper(treeHandlerSingleTagGet))
  .patch(validateRequest, handlerWrapper(treeHandlerSingleTagPatch));

router
  .route('/grower_accounts')
  .get(validateRequest, handlerWrapper(growerAccountHandlerGet))
  .post(validateRequest, handlerWrapper(growerAccountHandlerPost))
  .put(validateRequest, handlerWrapper(growerAccountHandlerPut));

router
  .route('/grower_accounts/:grower_account_id')
  .get(validateRequest, handlerWrapper(growerAccountHandlerSingleGet))
  .patch(validateRequest, handlerWrapper(growerAccountHandlerPatch));

router
  .route('/tags')
  .get(validateRequest, handlerWrapper(tagHandlerGet))
  .post(validateRequest, handlerWrapper(tagHandlerPost));

router
  .route('/tags/:tag_id')
  .get(validateRequest, handlerWrapper(tagHandlerSingleGet))
  .patch(validateRequest, handlerWrapper(tagHandlerPatch));

router
  .route('/captures')
  .get(validateRequest, handlerWrapper(captureHandlerGet))
  .post(validateRequest, handlerWrapper(captureHandlerPost));

router
  .route('/captures/:capture_id')
  .get(validateRequest, handlerWrapper(captureHandlerSingleGet))
  .patch(validateRequest, handlerWrapper(captureHandlerPatch));

router
  .route('/captures/:capture_id/tags')
  .get(validateRequest, handlerWrapper(captureHanglerTagGet))
  .post(validateRequest, handlerWrapper(captureHandlerTagPost));

router
  .route('/captures/:capture_id/tags/:tag_id')
  .get(validateRequest, handlerWrapper(captureHandlerSingleTagGet))
  .patch(validateRequest, handlerWrapper(captureHandlerSingleTagPatch));

module.exports = router;
