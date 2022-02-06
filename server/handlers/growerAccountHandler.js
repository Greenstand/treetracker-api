const Joi = require('joi');
const Session = require('../infra/database/Session');
const GrowerAccountRepository = require('../infra/repositories/GrowerAccountRepository');
const {
  getGrowerAccounts,
  GrowerAccountInsertObject,
  updateGrowerAccount,
  GrowerAccount,
} = require('../models/GrowerAccount');
const HttpError = require('../utils/HttpError');

const growerAccountGetQuerySchema = Joi.object({
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
  organization_id: Joi.string().uuid(),
  id: Joi.string().uuid(),
  wallet: Joi.string(),
}).unknown(false);

const growerAccountPostQuerySchema = Joi.object({
  wallet: Joi.string().required(),
  person_id: Joi.string().uuid(),
  organization_id: Joi.string().uuid(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().allow(null),
  phone: Joi.string().allow(null),
  image_url: Joi.string().uri().required(),
  image_rotation: Joi.number().integer(),
  first_registration_at: Joi.date().iso().required(),
}).unknown(false);

const growerAccountPatchQuerySchema = Joi.object({
  person_id: Joi.string().uuid(),
  organization_id: Joi.string().uuid(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
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

  if (!req.body.phone && !req.body.email) {
    throw new HttpError(422, 'Either phone or email is required');
  }

  const session = new Session();
  const growerAccountRepo = new GrowerAccountRepository(session);

  try {
    const growerAccountInsertObject = GrowerAccountInsertObject(req.body);
    const existingGrowerAccount = await growerAccountRepo.getByFilter({
      wallet: growerAccountInsertObject.wallet,
    });

    if (existingGrowerAccount.length === 0) {
      await session.beginTransaction();
      await growerAccountRepo.create(growerAccountInsertObject);
      await session.commitTransaction();
    }

    res.status(204).send();
    res.end();
  } catch (error) {
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(error);
  }
};

const growerAccountHandlerPatch = async function (req, res, next) {
  await growerAccountIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await growerAccountPatchQuerySchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const session = new Session();
  const growerAccountRepo = new GrowerAccountRepository(session);

  try {
    await session.beginTransaction();
    const executeUpdateGrowerAccount = updateGrowerAccount(growerAccountRepo);
    await executeUpdateGrowerAccount({ ...req.body, ...req.params });
    await session.commitTransaction();

    res.status(204).send();
    res.end();
  } catch (error) {
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(error);
  }
};

const growerAccountHandlerSingleGet = async function (req, res) {
  await growerAccountIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const growerAccountRepo = new GrowerAccountRepository(session);

  const growerAccount = await growerAccountRepo.getById(
    req.params.grower_account_id,
  );

  res.send(GrowerAccount(growerAccount));
};

const growerAccountHandlerPut = async function (req, res, next) {
  await growerAccountPostQuerySchema.validateAsync(req.body, {
    abortEarly: false,
  });

  if (!req.body.phone && !req.body.email) {
    throw new HttpError(422, 'Either phone or email is required');
  }

  const session = new Session();
  const growerAccountRepo = new GrowerAccountRepository(session);

  try {
    const growerAccountInsertObject = GrowerAccountInsertObject(req.body);
    const {
      wallet,
      first_name,
      last_name,
      phone,
      email,
    } = growerAccountInsertObject;
    const existingGrowerAccount = await growerAccountRepo.getByFilter({
      wallet,
    });
    let growerAccount = {};
    await session.beginTransaction();

    if (existingGrowerAccount.length > 0) {
      growerAccount = await growerAccountRepo.updateInfo({
        wallet,
        phone,
        first_name,
        last_name,
        email,
        updated_at: new Date().toISOString(),
      });
    } else {
      growerAccount = await growerAccountRepo.create(growerAccountInsertObject);
    }
    await session.commitTransaction();

    res.status(200).json(growerAccount);
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
  growerAccountHandlerSingleGet,
  growerAccountHandlerPut,
};
