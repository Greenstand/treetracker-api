const Joi = require('joi');
const log = require('loglevel');
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
  const filter = req.query;
  const session = new Session();
  const growerAccountRepo = new GrowerAccountRepository(session);

  const executeGetGrowerAccounts = getGrowerAccounts(growerAccountRepo);
  const { grower_accounts, growerAccountsCount } =
    await executeGetGrowerAccounts(req.query);

  const defaultRange = { limit: '100', offset: '0' };
  filter.limit = filter.limit ?? defaultRange.limit;
  filter.offset = filter.offset ?? defaultRange.offset;
  log.debug(filter);

  // offset starts from 0, hence the -1
  const noOfIterations = growerAccountsCount / filter.limit - 1;
  const currentIteration = filter.offset / filter.limit;

  const queryObject = { ...filter };

  delete queryObject.offset;

  /* eslint-disable no-param-reassign */
  const urlQuery = Object.entries(queryObject)
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result += `&${item[0]}=${item[1]}`;
      return result;
    }, '');
  /* eslint-enable no-param-reassign */

  const url = `grower_accounts`;
  const urlWithLimitAndOffset = `${url}${urlQuery || ''}&offset=`;

  const nextUrl =
    currentIteration < noOfIterations
      ? `${urlWithLimitAndOffset}${+filter.offset + +filter.limit}`
      : null;
  let prev = null;
  if (filter.offset - +filter.limit >= 0) {
    prev = `${urlWithLimitAndOffset}${+filter.offset - +filter.limit}`;
  }

  res.send({
    grower_accounts,
    links: {
      prev,
      next: nextUrl,
    },
  });
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
    const { wallet, first_name, last_name, phone, email, location, lat, lon } =
      growerAccountInsertObject;
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
        location,
        email,
        lat,
        lon,
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
