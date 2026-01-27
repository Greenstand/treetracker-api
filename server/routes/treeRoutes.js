const express = require('express');

const router = express.Router();
const { handlerWrapper, hasPermission } = require('../utils/utils');

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
const { ROLES, POLICIES } = require('../utils/enums');

router
  .route('/trees')
  .get(
    hasPermission(
      [POLICIES.LIST_TREE, POLICIES.APPROVE_TREE],
      ROLES.tree_manager,
    ),
    handlerWrapper(treeHandlerGet),
  )
  .post(
    hasPermission([POLICIES.APPROVE_TREE], ROLES.tree_manager),
    handlerWrapper(treeHandlerPost),
  );

router
  .route('/trees/potential_matches')
  .get(
    hasPermission(
      [POLICIES.MATCH_CAPTURES, POLICIES.LIST_TREE, POLICIES.APPROVE_TREE],
      ROLES.tree_manager,
    ),
    handlerWrapper(treeHandlerGetPotentialMatches),
  );

router
  .route('/trees/:tree_id')
  .get(
    hasPermission(
      [POLICIES.LIST_TREE, POLICIES.APPROVE_TREE],
      ROLES.tree_manager,
    ),
    handlerWrapper(treeHandlerSingleGet),
  )
  .patch(
    hasPermission([POLICIES.APPROVE_TREE], ROLES.tree_manager),
    handlerWrapper(treeHandlerPatch),
  );

router
  .route('/trees/:tree_id/tags')
  .get(
    hasPermission(
      [POLICIES.LIST_TREE, POLICIES.APPROVE_TREE],
      ROLES.tree_manager,
    ),
    handlerWrapper(treeHandlerTagGet),
  )
  .post(
    hasPermission([POLICIES.APPROVE_TREE], ROLES.tree_manager),
    handlerWrapper(treeHandlerTagPost),
  );

router
  .route('/trees/:tree_id/tags/:tag_id')
  .get(
    hasPermission(
      [POLICIES.LIST_TREE, POLICIES.APPROVE_TREE],
      ROLES.tree_manager,
    ),
    handlerWrapper(treeHandlerSingleTagGet),
  )
  .patch(
    hasPermission([POLICIES.APPROVE_TREE], ROLES.tree_manager),
    handlerWrapper(treeHandlerSingleTagPatch),
  );

module.exports = router;

// audit/event service is needed
