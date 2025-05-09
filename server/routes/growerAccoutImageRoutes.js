const express = require('express');
const multer = require('multer');

const router = express.Router();
const routerWrapper = express.Router();
const upload = multer({
  dest: 'tmp/img/',
  limits: {
    fileSize: 500000,
  },
  fileFilter: (_req, file, cb) => {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|webp/;
    const ofTypeImage = filetypes.test(file.mimetype);

    if (ofTypeImage) {
      return cb(null, true);
    }
    return cb('Error: Only jpeg, jpg, png, webp images allowed!');
  },
});
const { handlerWrapper } = require('../utils/utils');

const {
  growerAccountImageHandlerPost,
  growerAccountImageHandlerPatch,
} = require('../handlers/growerAccountImageHandler');
const { apiKeyHandler } = require('../middlewares/apikeyHandler');

router
  .route('/')
  .post(upload.single('image'), handlerWrapper(growerAccountImageHandlerPost));

router
  .route('/:image_id')
  .patch(handlerWrapper(growerAccountImageHandlerPatch));

routerWrapper.use('/grower_accounts/image', apiKeyHandler, router);
module.exports = routerWrapper;
