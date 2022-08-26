const express = require('express');

const router = express.Router();
const { handlerWrapper } = require('../utils/utils');

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
} = require('../handlers/treeHandler');

router
  .route('/trees')
  .get(handlerWrapper(treeHandlerGet))
  .post(handlerWrapper(treeHandlerPost));

router
  .route('/trees/potential_matches')
  .get(handlerWrapper(treeHandlerGetPotentialMatches));

router
  .route('/trees/:tree_id')
  .get(handlerWrapper(treeHandlerSingleGet))
  .patch(handlerWrapper(treeHandlerPatch));

router
  .route('/trees/:tree_id/tags')
  .get(handlerWrapper(treeHandlerTagGet))
  .post(handlerWrapper(treeHandlerTagPost));

router
  .route('/trees/:tree_id/tags/:tag_id')
  .get(handlerWrapper(treeHandlerSingleTagGet))
  .patch(handlerWrapper(treeHandlerSingleTagPatch));

module.exports = router;
