const Joi = require('joi');

const growerAccountImageIdQuerySchema = Joi.object({
  image_id: Joi.string().uuid().required(),
});

const growerAccountImagePatchSchema = Joi.object({
  active: Joi.boolean().required(),
});

module.exports = {
  growerAccountImageIdQuerySchema,
  growerAccountImagePatchSchema,
};
