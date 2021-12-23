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
  captureHandlerSingleGet,
  captureHanglerTagGet,
  captureHandlerTagPost,
  captureHanglerSingleTagGet,
  captureHandlerSingleTagPatch,
  captureHanglerSingleTagDelete,
} = require('./handlers/captureHandler.js');
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
  treeHandlerSingleTagDelete,
} = require('./handlers/treeHandler.js');
const {
  growerAccountHandlerGet,
  growerAccountHandlerPost,
  growerAccountHandlerPatch,
  growerAccountHandlerSingleGet,
} = require('./handlers/growerAccountHandler');
const {
  tagHandlerGet,
  tagHandlerPost,
  tagHandlerSingleGet,
  tagHandlerPatch,
} = require('./handlers/tagHandler');
const { groundUserHandlerGet } = require('./handlers/groundUserHandler.js');

router
  .route('/trees')
  .get(validateRequest, handlerWrapper(treeHandlerGet))
  .post(validateRequest, handlerWrapper(treeHandlerPost));

router
  .route('/trees/:tree_id')
  .get(validateRequest, handlerWrapper(treeHandlerSingleGet)) //todo
  .patch(validateRequest, handlerWrapper(treeHandlerPatch)); //todo

router
  .route('/trees/:tree_id/tags')
  .get(validateRequest, handlerWrapper(treeHandlerTagGet)) //todo
  .post(validateRequest, handlerWrapper(treeHandlerTagPost)); //todo

router
  .route('/trees/:tree_id/tags/:tag_id')
  .get(validateRequest, handlerWrapper(treeHandlerSingleTagGet)) //todo
  .patch(validateRequest, handlerWrapper(treeHandlerSingleTagPatch)) //todo
  .delete(validateRequest, handlerWrapper(treeHandlerSingleTagDelete)); //todo

router
  .route('/trees/:tree_id/potential_matches')
  .get(validateRequest, handlerWrapper(treeHandlerGetPotentialMatches));

// Legacy Planters Table
router
  .route('/ground_users')
  .get(validateRequest, handlerWrapper(groundUserHandlerGet));

router
  .route('/grower_accounts')
  .get(validateRequest, handlerWrapper(growerAccountHandlerGet))
  .post(validateRequest, handlerWrapper(growerAccountHandlerPost));

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
  .get(validateRequest, handlerWrapper(captureHanglerSingleTagGet))
  .patch(validateRequest, handlerWrapper(captureHandlerSingleTagPatch))
  .delete(validateRequest, handlerWrapper(captureHanglerSingleTagDelete));

module.exports = router;
