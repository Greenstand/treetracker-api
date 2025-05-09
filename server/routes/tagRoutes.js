const express = require('express');

const router = express.Router();
const routerWrapper = express.Router();
const { handlerWrapper } = require('../utils/utils');

const {
  tagHandlerGet,
  tagHandlerPost,
  tagHandlerSingleGet,
  tagHandlerPatch,
} = require('../handlers/tagHandler');
const { apiKeyHandler } = require('../middlewares/apikeyHandler');

router
  .route('/')
  .get(handlerWrapper(tagHandlerGet))
  .post(handlerWrapper(tagHandlerPost));

router
  .route('/:tag_id')
  .get(handlerWrapper(tagHandlerSingleGet))
  .patch(handlerWrapper(tagHandlerPatch));

routerWrapper.use('/tags', apiKeyHandler, router);
module.exports = routerWrapper;
