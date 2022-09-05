const Joi = require('joi');

const capturePostSchema = Joi.object({
  id: Joi.string().uuid().required(),
  session_id: Joi.string().uuid().required(),
  image_url: Joi.string().uri().required(),
  lat: Joi.number().required().min(-90).max(90).required(),
  lon: Joi.number().required().min(-180).max(180).required(),
  gps_accuracy: Joi.number().integer().required().allow(null),
  grower_account_id: Joi.string().uuid().required(),
  planting_organization_id: Joi.string().uuid().allow(null).default(null),
  device_configuration_id: Joi.string().uuid().required(),
  reference_id: Joi.number().integer().required(),
  tree_id: Joi.string().uuid().default(null),
  note: Joi.string().default(null),
  species_id: Joi.string().uuid().default(null),
  morphology: Joi.string().default(null),
  age: Joi.number().integer().default(null),
  captured_at: Joi.date().iso().required(),
  attributes: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required().allow(''),
      }),
    )
    .allow(null)
    .default(null),
  domain_specific_data: Joi.object().default(null),
}).unknown(false);

const captureGetQuerySchema = Joi.object({
  reference_id: Joi.number().integer(),
  tree_id: Joi.string().uuid(),
  tree_associated: Joi.boolean(),
  organization_ids: Joi.array().items(Joi.string().uuid()),
  captured_at_start_date: Joi.date().iso(),
  captured_at_end_date: Joi.date().iso(),
  grower_account_id: Joi.string().uuid(),
  species_id: Joi.string().uuid(),
  order_by: Joi.string().valid('captured_at', 'created_at'),
  order: Joi.string().valid('asc', 'desc'),
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
});

const capturePatchSchema = Joi.object({
  tree_id: Joi.string(),
  status: Joi.string(),
}).unknown(false);

const captureIdParamSchema = Joi.object({
  capture_id: Joi.string().uuid().required(),
}).unknown(true);

const captureTagIdQuerySchema = Joi.object({
  capture_id: Joi.string().uuid().required(),
  tag_id: Joi.string().uuid().required(),
}).unknown(true);

const captureTagsPostSchema = Joi.object({
  tags: Joi.array().items(Joi.string().uuid()).required().min(1),
}).unknown(false);

const captureTagPatchSchema = Joi.object({
  status: Joi.string().valid('active', 'deleted'),
}).unknown(false);

module.exports = {
  captureGetQuerySchema,
  captureTagPatchSchema,
  captureTagsPostSchema,
  captureTagIdQuerySchema,
  captureIdParamSchema,
  capturePatchSchema,
  capturePostSchema,
};
