const log = require('loglevel');
const Joi = require('joi');

const {
  createCapture,
  captureFromRequest,
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

const CapturePostSchema = Joi.object({
  session_id: Joi.string().uuid().required(),
  image_url: Joi.string().uri().required(),
  lat: Joi.number().required().min(-90).max(90).required(),
  lon: Joi.number().required().min(-180).max(180).required(),
  gps_accuracy: Joi.number().required(),
  grower_id: Joi.string().uuid().required(),
  grower_photo_url: Joi.string().uri().required(),
  grower_username: Joi.string().required(),
  planting_organization_id: Joi.string().uuid().required(),
  device_configuration_id: Joi.string().uuid().required(),
  reference_id: Joi.number().integer(),
  tree_id: Joi.string().uuid(),
  note: Joi.string(),
  species_id: Joi.string().uuid(),
  morphology: Joi.string(),
  age: Joi.number().integer(),
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

const CapturePatchSchema = Joi.object({
  tree_id: Joi.string().valid(null),
  species_id: Joi.string().uuid(),
  morphology: Joi.string(),
  age: Joi.number().integer(),
  status: Joi.string().valid('active', 'deleted'),
}).unknown(false);

const CaptureIdParamSchema = Joi.object({
  capture_id: Joi.string().uuid().required(),
}).unknown(true);

const TagIdQuerySchema = Joi.object({
  tag_id: Joi.string().uuid().required(),
}).unknown(true);

const CaptureTagsPostSchema = Joi.object({
  tags: Joi.array().items(Joi.string().uuid()).required().min(1),
}).unknown(false);

const CaptureTagPatchSchema = Joi.object({
  status: Joi.string().valid('active', 'deleted'),
}).unknown(false);

const captureHandlerGet = async function (req, res) {
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
  const eventRepository = new EventRepository(session);

  await CapturePostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const executeCreateCapture = createCapture(captureRepo, eventRepository);

  const eventDispatch = dispatch(eventRepository, publishMessage);

  try {
    const newCapture = captureFromRequest({ ...req.body });
    await session.beginTransaction();
    const { raisedEvents } = await executeCreateCapture(newCapture);
    await session.commitTransaction();
    raisedEvents.forEach((domainEvent) =>
      eventDispatch('capture-created', domainEvent),
    );
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
  await CapturePatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await CaptureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const captureRepo = new CaptureRepository(session);

  try {
    await session.beginTransaction();
    await captureRepo.update({
      id: req.params.capture_id,
      ...req.body,
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
  await CaptureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const captureRepo = new CaptureRepository(session);

  const capture = await captureRepo.getById(req.params.capture_id);

  res.send(Capture(capture));
};

const captureHanglerTagGet = async function (req, res) {
  await CaptureIdParamSchema.validateAsync(req.params, {
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
  await CaptureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await CaptureTagsPostSchema.validateAsync(req.body, {
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

const captureHanglerSingleTagGet = async function (req, res) {
  await CaptureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await TagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const captureTagRepo = new CaptureTagRepository(session);

  const executeGetCaptureTags = getCaptureTags(captureTagRepo);

  const result = await executeGetCaptureTags({
    capture_id: req.params.capture_id,
    tag_id: req.params.tag_id,
  });

  res.send(result);
};

const captureHandlerSingleTagPatch = async function (req, res, next) {
  await CaptureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await TagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await CaptureTagPatchSchema.validateAsync(req.body, {
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

const captureHanglerSingleTagDelete = async function (req, res, next) {
  await CaptureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await TagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const captureTagRepo = new CaptureTagRepository(session);

  try {
    await session.beginTransaction();
    // confirm if this is to happen or if a soft delete is to happen with status set to deleted
    await captureTagRepo.delete({
      capture_id: req.params.capture_id,
      tag_id: req.params.tag_id,
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
  captureHanglerSingleTagGet,
  captureHandlerSingleTagPatch,
  captureHanglerSingleTagDelete,
};
