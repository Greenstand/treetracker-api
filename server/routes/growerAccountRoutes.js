const express = require('express');

const router = express.Router();
const { handlerWrapper } = require('../utils/utils');

const {
  growerAccountHandlerGet,
  growerAccountHandlerPost,
  growerAccountHandlerPatch,
  growerAccountHandlerSingleGet,
  growerAccountHandlerPut,
} = require('../handlers/growerAccountHandler');

router
  .route('/grower_accounts')
  .get(handlerWrapper(growerAccountHandlerGet))
  .post(handlerWrapper(growerAccountHandlerPost))
  .put(handlerWrapper(growerAccountHandlerPut));

router
  .route('/grower_accounts/:grower_account_id')
  .get(handlerWrapper(growerAccountHandlerSingleGet))
  .patch(handlerWrapper(growerAccountHandlerPatch));

module.exports = router;
