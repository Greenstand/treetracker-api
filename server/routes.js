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
  captureHandlerSingleTagGet,
  captureHandlerSingleTagPatch,
  captureHandlerSingleTagDelete,
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
  .get(validateRequest, handlerWrapper(treeHandlerGet)) //tested
  .post(validateRequest, handlerWrapper(treeHandlerPost)); //tested

router
  .route('/trees/potential_matches')
  .get(validateRequest, handlerWrapper(treeHandlerGetPotentialMatches)); //tested

router
  .route('/trees/:tree_id')
  .get(validateRequest, handlerWrapper(treeHandlerSingleGet)) //tested
  .patch(validateRequest, handlerWrapper(treeHandlerPatch)); //tested

router
  .route('/trees/:tree_id/tags')
  .get(validateRequest, handlerWrapper(treeHandlerTagGet)) //tested
  .post(validateRequest, handlerWrapper(treeHandlerTagPost)); //tested

router
  .route('/trees/:tree_id/tags/:tag_id')
  .get(validateRequest, handlerWrapper(treeHandlerSingleTagGet)) //tested
  .patch(validateRequest, handlerWrapper(treeHandlerSingleTagPatch)) //tested
  .delete(validateRequest, handlerWrapper(treeHandlerSingleTagDelete)); //tested

// Legacy Planters Table
router
  .route('/ground_users')
  .get(validateRequest, handlerWrapper(groundUserHandlerGet));

router
  .route('/grower_accounts')
  .get(validateRequest, handlerWrapper(growerAccountHandlerGet)) //tested
  .post(validateRequest, handlerWrapper(growerAccountHandlerPost)); //tested

router
  .route('/grower_accounts/:grower_account_id')
  .get(validateRequest, handlerWrapper(growerAccountHandlerSingleGet)) //tested
  .patch(validateRequest, handlerWrapper(growerAccountHandlerPatch)); //tested

router
  .route('/tags')
  .get(validateRequest, handlerWrapper(tagHandlerGet)) //tested
  .post(validateRequest, handlerWrapper(tagHandlerPost)); //tested

router
  .route('/tags/:tag_id')
  .get(validateRequest, handlerWrapper(tagHandlerSingleGet)) //tested
  .patch(validateRequest, handlerWrapper(tagHandlerPatch)); //tested

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
  .patch(validateRequest, handlerWrapper(captureHandlerSingleTagPatch))
  .delete(validateRequest, handlerWrapper(captureHandlerSingleTagDelete));

module.exports = router;
