const express = require('express');

const router = express.Router();
const { handlerWrapper } = require('../utils/utils');

const {
  tagHandlerGet,
  tagHandlerPost,
  tagHandlerSingleGet,
  tagHandlerPatch,
} = require('../handlers/tagHandler');

router
  .route('/tags')
  .get(handlerWrapper(tagHandlerGet))
  .post(handlerWrapper(tagHandlerPost));

router
  .route('/tags/:tag_id')
  .get(handlerWrapper(tagHandlerSingleGet))
  .patch(handlerWrapper(tagHandlerPatch));

module.exports = router;
