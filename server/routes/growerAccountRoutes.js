const express = require('express');

const router = express.Router();
const { handlerWrapper } = require('../utils/utils');

const {
  growerAccountHandlerGet,
  growerAccountHandlerPut,
  growerAccountHandlerPost,
  growerAccountHandlerPatch,
  growerAccountHandlerSingleGet,
} = require('../handlers/growerAccountHandler');

router
  .route('/grower_accounts')
  .get(handlerWrapper(growerAccountHandlerGet))
  .post(handlerWrapper(growerAccountHandlerPost)) // feature flag
  .put(handlerWrapper(growerAccountHandlerPut)); // M2M token for transformer-v2

router
  .route('/grower_accounts/:grower_account_id')
  .get(handlerWrapper(growerAccountHandlerSingleGet))
  .patch(handlerWrapper(growerAccountHandlerPatch));

module.exports = router;
