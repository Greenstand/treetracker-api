const express = require('express');

const router = express.Router();
const routerWrapper = express.Router();
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
const { apiKeyHandler } = require('../middlewares/apikeyHandler');

router
  .route('/')
  .get(handlerWrapper(treeHandlerGet))
  .post(handlerWrapper(treeHandlerPost));

router
  .route('/potential_matches')
  .get(handlerWrapper(treeHandlerGetPotentialMatches));

router
  .route('/:tree_id')
  .get(handlerWrapper(treeHandlerSingleGet))
  .patch(handlerWrapper(treeHandlerPatch));

router
  .route('/:tree_id/tags')
  .get(handlerWrapper(treeHandlerTagGet))
  .post(handlerWrapper(treeHandlerTagPost));

router
  .route('/:tree_id/tags/:tag_id')
  .get(handlerWrapper(treeHandlerSingleTagGet))
  .patch(handlerWrapper(treeHandlerSingleTagPatch));

routerWrapper.use('/trees', apiKeyHandler, router);
module.exports = routerWrapper;
