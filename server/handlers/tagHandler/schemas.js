const Joi = require('joi');

const tagGetQuerySchema = Joi.object({
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
  owner_id: Joi.string().allow(null),
}).unknown(false);

const tagPostQuerySchema = Joi.object({
  isPublic: Joi.boolean().required(),
  name: Joi.string().required(),
  owner_id: Joi.string().allow(null),
}).unknown(false);

const TagPatchQuerySchema = Joi.object({
  isPublic: Joi.boolean(),
  status: Joi.string().valid('active', 'deleted'),
}).unknown(false);

const TagIdQuerySchema = Joi.object({
  tag_id: Joi.string().uuid().required(),
});

module.exports = {
  tagGetQuerySchema,
  tagPostQuerySchema,
  TagPatchQuerySchema,
  TagIdQuerySchema,
};
