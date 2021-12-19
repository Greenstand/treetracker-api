const Joi = require('joi');
const Session = require('../infra/database/Session');
const GrowerAccountRepository = require('../infra/repositories/GrowerAccountRepository');
const {
  getGrowerAccounts,
  GrowerAccountInsertObject,
  updateGrowerAccount,
} = require('../models/GrowerAccount');

const growerAccountGetQuerySchema = Joi.object({
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
}).unknown(false);

const growerAccountPostQuerySchema = Joi.object({
  wallet_id: Joi.string().uuid().required(),
  wallet: Joi.string().required(),
  person_id: Joi.string().uuid(),
  organization_id: Joi.string().uuid(),
  name: Joi.string().required(),
  email: Joi.string().email(),
  phone: Joi.string(),
  image_url: Joi.string().uri().required(),
  image_rotation: Joi.number().integer(),
  status: Joi.string().valid('active', 'deleted'),
  first_registration_at: Joi.date().iso().required(),
})
  .unknown(false)
  .or('email', 'phone');

const growerAccountPatchQuerySchema = Joi.object({
  grower_account_id: Joi.string().uuid().required(),
  person_id: Joi.string().uuid(),
  organization_id: Joi.string().uuid(),
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  image_url: Joi.string().uri(),
  image_rotation: Joi.number().integer(),
  status: Joi.string().valid('active', 'deleted'),
}).unknown(false);

const growerAccountHandlerGet = async function (req, res) {
  await growerAccountGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });
  const session = new Session();
  const growerAccountRepo = new GrowerAccountRepository(session);

  const url = `grower_accounts`;

  const executeGetGrowerAccounts = getGrowerAccounts(growerAccountRepo);
  const result = await executeGetGrowerAccounts(req.query, url);

  res.send(result);
  res.end();
};
const growerAccountHandlerPost = async function (req, res, next) {
  await growerAccountPostQuerySchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const session = new Session();
  const growerAccountRepo = new GrowerAccountRepository(session);

  try {
    const growerAccountInsertObject = GrowerAccountInsertObject(req.body);
    await growerAccountRepo.create(growerAccountInsertObject);

    res.status(204).send();
    res.end();
  } catch (error) {
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(error);
  }
};
const growerAccountHandlerPatch = async function (req, res) {
  await growerAccountPatchQuerySchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const session = new Session();
  const growerAccountRepo = new GrowerAccountRepository(session);

  try {
    const executeGrowerAccount = updateGrowerAccount(growerAccountRepo);
    await executeGrowerAccount(req.body);

    res.status(204).send();
    res.end();
  } catch (error) {
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(error);
  }
};

module.exports = {
  growerAccountHandlerGet,
  growerAccountHandlerPost,
  growerAccountHandlerPatch,
};
