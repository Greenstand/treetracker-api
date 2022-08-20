const Joi = require('joi');

const treePostSchema = Joi.object({
  id: Joi.string().uuid().required(),
  latest_capture_id: Joi.string().uuid().required(),
  image_url: Joi.string().uri().required(),
  lat: Joi.number().min(0).max(90).required(),
  lon: Joi.number().min(0).max(180).required(),
  gps_accuracy: Joi.number().integer().required().required(),
  species_id: Joi.string().uuid().default(null),
  morphology: Joi.string().default(null),
  age: Joi.number().integer().default(null),
  attributes: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required().allow(''),
      }),
    )
    .allow(null)
    .default(null),
});

const treePatchSchema = Joi.object({
  latest_capture_id: Joi.string().uuid(),
  image_url: Joi.string().uri(),
  species_id: Joi.string().uuid(),
  morphology: Joi.string(),
  age: Joi.number().integer(),
  status: Joi.string().valid('active', 'deleted'),
}).unknown(false);

const treeIdParamSchema = Joi.object({
  tree_id: Joi.string().uuid().required(),
}).unknown(false);

const treePotentialMatchestSchema = Joi.object({
  capture_id: Joi.string().uuid().required(),
}).unknown(false);

const treeTagsPostSchema = Joi.object({
  tags: Joi.array().items(Joi.string().uuid()).required().min(1),
}).unknown(false);

const treeTagIdQuerySchema = Joi.object({
  tree_id: Joi.string().uuid().required(),
  tag_id: Joi.string().uuid().required(),
}).unknown(false);

const treeTagPatchSchema = Joi.object({
  status: Joi.string().valid('active', 'deleted'),
}).unknown(false);

const treeGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
});

module.exports = {
  treePostSchema,
  treeGetQuerySchema,
  treeTagPatchSchema,
  treeTagIdQuerySchema,
  treeTagsPostSchema,
  treePotentialMatchestSchema,
  treeIdParamSchema,
  treePatchSchema,
};
