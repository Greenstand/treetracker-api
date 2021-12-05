
const { v4: uuidv4 } = require('uuid');
const log = require('loglevel');
const Joi = require('joi');

const {
  createCapture,
  captureFromRequest,
  getCaptures,
  updateCapture,
} = require('../models/Capture');
const { dispatch } = require('../models/DomainEvent');

const Session = require('../infra/database/Session');
const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const CaptureRepository = require('../infra/repositories/CaptureRepository');
const EventRepository = require('../infra/repositories/EventRepository');

const captureHandlerGet = async function (req, res) {
  const session = new Session(false);
  const captureRepo = new CaptureRepository(session);
  const executeGetCaptures = getCaptures(captureRepo);
  const result = await executeGetCaptures(req.query);
  res.send(result);
  res.end();
};

const captureHandlerPost = async function (req, res) {
  const session = new Session();
  const captureRepo = new CaptureRepository(session);
  const eventRepository = new EventRepository(session);
  const executeCreateCapture = createCapture(captureRepo, eventRepository);

  const eventDispatch = dispatch(eventRepository, publishMessage);

  // destructure from req.body and set defaults
  const {
    reference_id,
    image_url = '',
    estimated_geometric_location,
    lon,
    lat,
    planter_id,
    planter_photo_url = '',
    planter_username,
    device_identifier,
    note = '',
    attributes = [],
  } = req.body;

  // create tree data including unique id and setting date/time to today
  const capture = {
    id: uuidv4(),
    reference_id,
    image_url,
    estimated_geometric_location,
    lat,
    lon,
    planter_id,
    planter_photo_url,
    planter_username,
    device_identifier,
    note,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    attributes,
  };

  try {
    const newCapture = captureFromRequest({ ...capture });
    await session.beginTransaction();
    const { entity, raisedEvents } = await executeCreateCapture(newCapture);
    await session.commitTransaction();
    raisedEvents.forEach((domainEvent) =>
      eventDispatch('capture-created', domainEvent),
    );
    res.status(201).json({
      ...entity,
    });
  } catch (e) {
    log.warn(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    const result = e;
    res.status(422).json({ ...result });
  }
};

const captureHandlerPatch = async function (req, res, next) {
  const { capture_id } = req.params;
  const session = new Session();
  const captureRepo = new CaptureRepository(session);
  const executeUpdateCapture = updateCapture(captureRepo);
  const updateCaptureSchema = Joi.object({
    tree_id: Joi.string().uuid(),
    id: Joi.any().forbidden(),
    lat: Joi.any().forbidden(),
    lon: Joi.any().forbidden(),
    location: Joi.any().forbidden(),
    created_at: Joi.any().forbidden(),
  });
  try {
    await updateCaptureSchema.unknown(true).validateAsync(req.body, {
      abortEarly: false,
    });
    const result = await executeUpdateCapture({ id: capture_id, ...req.body });
    res.send(result);
    res.end();
  } catch (e) {
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
};
