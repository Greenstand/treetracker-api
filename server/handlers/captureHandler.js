const log = require('loglevel');
const Joi = require('joi');

const {
  createCapture,
  captureInsertObject,
  getCaptures,
  Capture,
} = require('../models/Capture');
const { getCaptureTags, addTagsToCapture } = require('../models/CaptureTag');
const { dispatch } = require('../models/DomainEvent');

const Session = require('../infra/database/Session');
const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const CaptureRepository = require('../infra/repositories/CaptureRepository');
const CaptureTagRepository = require('../infra/repositories/CaptureTagRepository');
const EventRepository = require('../infra/repositories/EventRepository');

const capturePostSchema = Joi.object({
  id: Joi.string().uuid().required(),
  session_id: Joi.string().uuid().required(),
  image_url: Joi.string().uri().required(),
  lat: Joi.number().required().min(-90).max(90).required(),
  lon: Joi.number().required().min(-180).max(180).required(),
  gps_accuracy: Joi.number().integer().required(),
  grower_account_id: Joi.string().uuid().required(),
  planting_organization_id: Joi.string().uuid().required(),
  device_configuration_id: Joi.string().uuid().required(),
  reference_id: Joi.number().integer(),
  tree_id: Joi.string().uuid(),
  note: Joi.string(),
  species_id: Joi.string().uuid(),
  morphology: Joi.string(),
  age: Joi.number().integer(),
  captured_at: Joi.date().iso().required(),
  attributes: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required().allow(''),
      }),
    )
    .allow(null),
  domain_specific_data: Joi.object(),
}).unknown(false);

const captureGetQuerySchema = Joi.object({
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

const captureHandlerGet = async function (req, res) {
  await captureGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });
  const session = new Session(false);
  const captureRepo = new CaptureRepository(session);
  const executeGetCaptures = getCaptures(captureRepo);
  const result = await executeGetCaptures(req.query);
  res.send(result);
  res.end();
};

const captureHandlerPost = async function (req, res, next) {
  const session = new Session();
  const captureRepo = new CaptureRepository(session);
  const eventRepo = new EventRepository(session);

  await capturePostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const executeCreateCapture = createCapture(captureRepo, eventRepo);

  const eventDispatch = dispatch(eventRepo, publishMessage);

  try {
    const newCapture = captureInsertObject({ ...req.body });
    const existingCapture = await captureRepo.getById(newCapture.id);
    if (existingCapture) {
      const domainEvent = await eventRepo.getDomainEvent(newCapture.id);
      if (domainEvent.status !== 'sent') {
        eventDispatch('capture-created', domainEvent);
      }
    } else {
      await session.beginTransaction();
      const {
        raisedEvents: { domainEvent },
      } = await executeCreateCapture(newCapture);
      await session.commitTransaction();
      eventDispatch('capture-created', domainEvent);
    }

    res.status(204).send();
    res.end();
  } catch (e) {
    log.warn(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(e);
  }
};

const captureHandlerPatch = async function (req, res, next) {
  await capturePatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await captureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const captureRepo = new CaptureRepository(session);

  try {
    await session.beginTransaction();
    await captureRepo.update({
      id: req.params.capture_id,
      ...req.body,
      updated_at: new Date().toISOString(),
    });
    await session.commitTransaction();
    res.status(204).send();
    res.end();
  } catch (e) {
    log.warn(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(e);
  }
};

const captureHandlerSingleGet = async function (req, res) {
  await captureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const captureRepo = new CaptureRepository(session);

  const {
    captures: [capture = {}],
  } = await captureRepo.getByFilter({
    parameters: {
      id: req.params.capture_id,
    },
  });

  res.send(Capture(capture));
};

const captureHanglerTagGet = async function (req, res) {
  await captureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const captureTagRepo = new CaptureTagRepository(session);

  const executeGetCaptureTags = getCaptureTags(captureTagRepo);

  const result = await executeGetCaptureTags({
    capture_id: req.params.capture_id,
  });

  res.send(result);
};

const captureHandlerTagPost = async function (req, res, next) {
  await captureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await captureTagsPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const session = new Session();
  const captureTagRepo = new CaptureTagRepository(session);

  try {
    await session.beginTransaction();

    const executeAddTagsToCapture = addTagsToCapture(captureTagRepo);
    await executeAddTagsToCapture({
      tags: req.body.tags,
      capture_id: req.params.capture_id,
    });

    await session.commitTransaction();
    res.status(204).send();
    res.end();
  } catch (e) {
    log.warn(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(e);
  }
};

const captureHandlerSingleTagGet = async function (req, res) {
  await captureTagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const captureTagRepo = new CaptureTagRepository(session);

  const executeGetCaptureTags = getCaptureTags(captureTagRepo);

  const result = await executeGetCaptureTags({
    capture_id: req.params.capture_id,
    tag_id: req.params.tag_id,
  });

  const [r = {}] = result;

  res.send(r);
};

const captureHandlerSingleTagPatch = async function (req, res, next) {
  await captureTagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await captureTagPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const session = new Session();
  const captureTagRepo = new CaptureTagRepository(session);

  try {
    await session.beginTransaction();
    await captureTagRepo.update({
      capture_id: req.params.capture_id,
      tag_id: req.params.tag_id,
      ...req.body,
      updated_at: new Date().toISOString(),
    });
    await session.commitTransaction();
    res.status(204).send();
    res.end();
  } catch (e) {
    log.warn(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(e);
  }
};

const captureHandlerSingleTagDelete = async function (req, res, next) {
  await captureTagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const captureTagRepo = new CaptureTagRepository(session);

  try {
    await session.beginTransaction();
    await captureTagRepo.update({
      capture_id: req.params.capture_id,
      tag_id: req.params.tag_id,
      status: 'deleted',
      updated_at: new Date().toISOString(),
    });
    await session.commitTransaction();
    res.status(204).send();
    res.end();
  } catch (e) {
    log.warn(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(e);
  }
};

module.exports = {
  captureHandlerPost,
  captureHandlerGet,
  captureHandlerPatch,
  captureHandlerSingleGet,
  captureHanglerTagGet,
  captureHandlerTagPost,
  captureHandlerSingleTagGet,
  captureHandlerSingleTagPatch,
  captureHandlerSingleTagDelete,
};
