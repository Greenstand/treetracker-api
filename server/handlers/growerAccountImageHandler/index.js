const {
  growerAccountImagePatchSchema,
  growerAccountImageIdQuerySchema,
} = require('./schemas');
const GrowerAccountImageService = require('../../services/GrowerAccountImageService');

const {
  growerAccountIdQuerySchema,
} = require('../growerAccountHandler/schemas');

const growerAccountImageHandlerPost = async function (req, res) {
  await growerAccountIdQuerySchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const growerAccountImageService = new GrowerAccountImageService();

  const growerAccountImage = await growerAccountImageService.createImage({
    file: req.file,
    body: req.body,
  });

  res.status(201).send(growerAccountImage);
  res.end();
};

const growerAccountImageHandlerPatch = async function (req, res) {
  await growerAccountImagePatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await growerAccountImageIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const growerAccountImageService = new GrowerAccountImageService();

  const growerAccountImage = await growerAccountImageService.updateImage({
    id: req.params.image_id,
    active: req.body.active,
  });

  res.send(growerAccountImage);
  res.end();
};

module.exports = {
  growerAccountImageHandlerPatch,
  growerAccountImageHandlerPost,
};
