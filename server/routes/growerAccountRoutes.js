const express = require('express');

const router = express.Router();
const routerWrapper = express.Router();
const { handlerWrapper } = require('../utils/utils');

const {
  growerAccountHandlerGet,
  growerAccountHandlerPut,
  growerAccountHandlerPost,
  growerAccountHandlerPatch,
  growerAccountHandlerSingleGet,
} = require('../handlers/growerAccountHandler');
const { apiKeyHandler } = require('../middlewares/apikeyHandler');

router
  .route('/')
  .get(handlerWrapper(growerAccountHandlerGet))
  .post(handlerWrapper(growerAccountHandlerPost))
  .put(handlerWrapper(growerAccountHandlerPut));

router
  .route('/:grower_account_id')
  .get(handlerWrapper(growerAccountHandlerSingleGet))
  .patch(handlerWrapper(growerAccountHandlerPatch));

routerWrapper.use('/grower_accounts', apiKeyHandler, router);
module.exports = routerWrapper;
