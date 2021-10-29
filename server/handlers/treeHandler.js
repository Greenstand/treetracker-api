const express = require('express');
const log = require("loglevel");
const treeRouter = express.Router();
const Joi = require('joi');

const { createTree, treeFromRequest, potentialMatches } = require('../models/tree');
const { dispatch } = require('../models/DomainEvent');

const Session = require('../infra/database/Session');
const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const EventRepository = require('../infra/repositories/EventRepository');
const TreeRepository = require('../infra/repositories/TreeRepository');

const utils = require("./utils");

const treeHandlerGet = async function (req, res) {
  const session = new Session(false);
  // todo
  const result = {};
  res.send(result);
  res.end();
};

const treeHandlerGetPotentialMatches = async function (req, res) {
  const session = new Session(false);
  const captureRepo = new TreeRepository(session);
};

const treeSchema = Joi.object({
  capture_id: Joi.string().guid(),
  image_url: Joi.string().uri(),
  lat: Joi.number().min(0).max(90),
  lon: Joi.number().min(0).max(180),
});

const treeHandlerPost = async function (req, res, next) {
  const session = new Session();
  const captureRepo = new TreeRepository(session);
  const eventRepository = new EventRepository(session);
  const executeCreateTree = createTree(captureRepo);

  // const eventDispatch = dispatch(eventRepository, publishMessage);
  const now = new Date().toISOString();
  const tree = treeFromRequest({
    ...req.body,
    created_at: now,
    updated_at: now,
  });

  try {
    const value = await treeSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    await session.beginTransaction();
    // const { entity, raisedEvents } = await executeCreateTree(tree);
    const treeEntity = await executeCreateTree(tree);
    await session.commitTransaction();
    /* raisedEvents.forEach((domainEvent) =>
          eventDispatch('capture-created', domainEvent),
        ); */
    res.status(201).json({
      ...treeEntity,
    });
  } catch (e) {
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(e);
  }
};

const treeHandlerGetPotentialMatches = utils.handlerWrapper(async (req, res) => {
  log.warn("handle potentialMatches");
  const session = new Session();
  const execute = potentialMatches(session);
  const result = await execute(req.query.capture_id);
  log.warn("result of match:", result);
  res.status(200).json({matches: result});
});

module.exports = {
  treeHandlerGet,
  treeHandlerPost,
  treeHandlerGetPotentialMatches,
};
