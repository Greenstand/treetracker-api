const log = require('loglevel');
const Joi = require('joi');


const {
  getTrees,
  createTree,
  treeFromRequest,
  potentialMatches,
} = require('../models/tree');

const { getCaptures } = require('../models/Capture');
const { dispatch } = require('../models/DomainEvent');

const Session = require('../infra/database/Session');
const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const CaptureRepository = require('../infra/repositories/CaptureRepository');
const EventRepository = require('../infra/repositories/EventRepository');
const TreeRepository = require('../infra/repositories/TreeRepository');

const utils = require('./utils');

const treeHandlerGet = async function (req, res) {
  const session = new Session(false);
  const treeRepo = new TreeRepository(session);
  const executeGetTrees = getTrees(treeRepo);
  const result = await executeGetTrees(req.query);
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

  const eventDispatch = dispatch(eventRepository, publishMessage);
  const now = new Date().toISOString();
  const tree = treeFromRequest({
    ...req.body,
    created_at: now,
    updated_at: now,
  });

  try {
    await treeSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    await session.beginTransaction();
    const { treeEntity, raisedEvents } = await executeCreateTree(tree);
    await session.commitTransaction();
    raisedEvents.forEach((domainEvent) =>
      eventDispatch('capture-created', domainEvent),
    );
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


const getCapturesByTreeId = async function (treeId) {
  const session = new Session(false);
  const captureRepo = new CaptureRepository(session);
  const executeGetCaptures = getCaptures(captureRepo);
  const captures = await executeGetCaptures({ tree_id: treeId });
  return captures;
};

const treeHandlerGetPotentialMatches = utils.handlerWrapper(
  async (req, res) => {
    log.warn('handle potentialMatches');
    const session = new Session();
    const treeRepository = new TreeRepository(session);
    const execute = potentialMatches(treeRepository);
    const potentialTrees = await execute(req.params.capture_id);
    log.warn('result of match:', potentialTrees.length);

    // get the captures for each match and add as .captures
    const matches = await Promise.all(
      potentialTrees.map(async (tree) => {
        // eslint-disable-next-line no-param-reassign
        tree.captures = await getCapturesByTreeId(tree.id);
        return tree;
      }),
    );
    res.status(200).json({ matches });
  },
);

module.exports = {
  treeHandlerGet,
  treeHandlerPost,
  treeHandlerGetPotentialMatches,
};
