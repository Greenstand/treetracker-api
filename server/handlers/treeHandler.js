const express = require('express');

const treeRouter = express.Router();
const Joi = require('joi');

const { createTree, treeFromRequest } = require('../models/tree');
const { dispatch } = require('../models/DomainEvent');

const Session = require('../infra/database/Session');
const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const EventRepository = require('../infra/database/EventRepository');
const TreeRepository = require('../infra/database/TreeRepository');

const treeHandlerGet = async function (req, res) {
  const session = new Session(false);
  // todo
  const result = {};
  res.send(result);
  res.end();
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

module.exports = {
  treeHandlerGet,
  treeHandlerPost,
};
