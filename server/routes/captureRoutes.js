const express = require('express');

const router = express.Router();
const routerWrapper = express.Router();
const { handlerWrapper } = require('../utils/utils');

const {
  captureHandlerPost,
  captureHandlerGet,
  captureHandlerPatch,
  captureHandlerSingleGet,
  captureHandlerTagGet,
  captureHandlerTagPost,
  captureHandlerSingleTagGet,
  captureHandlerSingleTagPatch,
} = require('../handlers/captureHandler');
const { apiKeyHandler } = require('../middlewares/apikeyHandler');

router
  .route('/')
  .get(handlerWrapper(captureHandlerGet))
  .post(handlerWrapper(captureHandlerPost));

router
  .route('/:capture_id')
  .get(handlerWrapper(captureHandlerSingleGet))
  .patch(handlerWrapper(captureHandlerPatch));

router
  .route('/:capture_id/tags')
  .get(handlerWrapper(captureHandlerTagGet))
  .post(handlerWrapper(captureHandlerTagPost));

router
  .route('/:capture_id/tags/:tag_id')
  .get(handlerWrapper(captureHandlerSingleTagGet))
  .patch(handlerWrapper(captureHandlerSingleTagPatch));

routerWrapper.use('/captures', apiKeyHandler, router);
module.exports = routerWrapper;
