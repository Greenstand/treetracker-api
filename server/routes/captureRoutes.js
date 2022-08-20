const express = require('express');

const router = express.Router();
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

router
  .route('/captures')
  .get(handlerWrapper(captureHandlerGet))
  .post(handlerWrapper(captureHandlerPost));

router
  .route('/captures/:capture_id')
  .get(handlerWrapper(captureHandlerSingleGet))
  .patch(handlerWrapper(captureHandlerPatch));

router
  .route('/captures/:capture_id/tags')
  .get(handlerWrapper(captureHandlerTagGet))
  .post(handlerWrapper(captureHandlerTagPost));

router
  .route('/captures/:capture_id/tags/:tag_id')
  .get(handlerWrapper(captureHandlerSingleTagGet))
  .patch(handlerWrapper(captureHandlerSingleTagPatch));

module.exports = router;
