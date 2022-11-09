const express = require('express');
const { handlerWrapper } = require('../utils/utils');
const { uploadImage } = require('../handlers/imageHandler');

const router = express.Router();

router.route('/image_upload').post(handlerWrapper(uploadImage));

module.exports = router;
