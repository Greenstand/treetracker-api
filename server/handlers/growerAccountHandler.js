const Joi = require('joi');
const GrowerAccountService = require('../services/GrowerAccountService');
const HttpError = require('../utils/HttpError');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');

const growerAccountGetQuerySchema = Joi.object({
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
  organization_id: Joi.string().uuid(),
  id: Joi.string().uuid(),
  wallet: Joi.string(),
  bulk_pack_file_name: Joi.string(),
}).unknown(false);

const growerAccountPostQuerySchema = Joi.object({
  wallet: Joi.string().required(), //
  person_id: Joi.string().uuid(),
  organization_id: Joi.string().uuid(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  lat: Joi.number().required().min(-90).max(90),
  lon: Joi.number().required().min(-180).max(180),
  email: Joi.string().allow(null),
  phone: Joi.string().allow(null),
  about: Joi.string().allow(null),
  image_url: Joi.string().uri().required(),
  image_rotation: Joi.number().integer(),
  first_registration_at: Joi.date().iso().required(),
  bulk_pack_file_name: Joi.string(),
}).unknown(false);

const growerAccountPatchQuerySchema = Joi.object({
  person_id: Joi.string().uuid(),
  organization_id: Joi.string().uuid(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  about: Joi.string(),
  image_url: Joi.string().uri(),
  image_rotation: Joi.number().integer(),
  status: Joi.string().valid('active', 'deleted'),
}).unknown(false);

const growerAccountIdQuerySchema = Joi.object({
  grower_account_id: Joi.string().uuid().required(),
});

const growerAccountHandlerGet = async function (req, res) {
  await growerAccountGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const growerAccountService = new GrowerAccountService();
  const growerAccounts = await growerAccountService.getGrowerAccounts(
    filter,
    limitOptions,
  );
  const count = await growerAccountService.getGrowerAccountsCount(filter);

  const url = 'grower_accounts';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    grower_accounts: growerAccounts,
    links,
    query: { count, ...limitOptions, ...filter },
  });
  res.end();
};

const growerAccountHandlerPost = async function (req, res) {
  await growerAccountPostQuerySchema.validateAsync(req.body, {
    abortEarly: false,
  });

  if (!req.body.phone && !req.body.email) {
    throw new HttpError(422, 'Either phone or email is required');
  }

  const growerAccountService = new GrowerAccountService();

  const { growerAccount, status } =
    await growerAccountService.createGrowerAccount(req.body);

  res.status(status).send(growerAccount);
  res.end();
};

const growerAccountHandlerPatch = async function (req, res) {
  await growerAccountIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await growerAccountPatchQuerySchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const growerAccountService = new GrowerAccountService();

  const growerAccount = await growerAccountService.updateGrowerAccount({
    ...req.body,
    id: req.params.grower_account_id,
  });

  res.send(growerAccount);
  res.end();
};

const growerAccountHandlerSingleGet = async function (req, res) {
  await growerAccountIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const growerAccountService = new GrowerAccountService();

  const growerAccount = await growerAccountService.getGrowerAccountById(
    req.params.grower_account_id,
  );

  if (!growerAccount.id)
    throw new HttpError(
      400,
      `Grower Account with id ${req.params.grower_account_id} not found`,
    );

  res.send(growerAccount);
};

const growerAccountHandlerPut = async function (req, res) {
  await growerAccountPostQuerySchema.validateAsync(req.body, {
    abortEarly: false,
  });

  if (!req.body.phone && !req.body.email) {
    throw new HttpError(422, 'Either phone or email is required');
  }

  const growerAccountService = new GrowerAccountService();

  const { growerAccount, status } =
    await growerAccountService.upsertGrowerAccount(req.body);

  res.status(status).send(growerAccount);
  res.end();
};

module.exports = {
  growerAccountHandlerGet,
  growerAccountHandlerPost,
  growerAccountHandlerPatch,
  growerAccountHandlerSingleGet,
  growerAccountHandlerPut,
};
