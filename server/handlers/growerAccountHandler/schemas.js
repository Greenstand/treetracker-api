const Joi = require('joi');

const growerAccountGetQuerySchema = Joi.object({
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
  organization_id: Joi.string().uuid(),
  id: Joi.string().uuid(),
  wallet: Joi.string(),
  bulk_pack_file_name: Joi.string(),
  show_in_map: Joi.boolean(),
}).unknown(false);

const growerAccountPostQuerySchema = Joi.object({
  wallet: Joi.string().required(),
  person_id: Joi.string().uuid(),
  organization_id: Joi.string().uuid(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  lat: Joi.number().required().min(-90).max(90),
  lon: Joi.number().required().min(-180).max(180),
  email: Joi.string().allow(null),
  phone: Joi.string().allow(null),
  about: Joi.string().max(200).allow(null),
  gender: Joi.string().valid('male', 'female', 'neutral').allow(null),
  image_url: Joi.string().uri().required(),
  image_rotation: Joi.number().integer(),
  first_registration_at: Joi.date().iso().required(),
  bulk_pack_file_name: Joi.string(),
  show_in_map: Joi.boolean(),
}).unknown(false);

const growerAccountPatchQuerySchema = Joi.object({
  person_id: Joi.string().uuid(),
  organization_id: Joi.string().uuid(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  about: Joi.string().max(200),
  image_url: Joi.string().uri(),
  image_rotation: Joi.number().integer(),
  status: Joi.string().valid('active', 'deleted'),
  gender: Joi.string().valid('male', 'female', 'neutral'),
  show_in_map: Joi.boolean(),
}).unknown(false);

const growerAccountIdQuerySchema = Joi.object({
  grower_account_id: Joi.string().uuid().required(),
});

module.exports = {
  growerAccountIdQuerySchema,
  growerAccountPatchQuerySchema,
  growerAccountPostQuerySchema,
  growerAccountGetQuerySchema,
};
