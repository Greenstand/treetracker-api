const log = require('loglevel');
const Joi = require('joi');

const {
  getTrees,
  createTree,
  treeInsertObject,
  potentialMatches,
  Tree,
} = require('../models/tree');
const { getTreeTags, addTagsToTree } = require('../models/TreeTag');
const { getCaptures } = require('../models/Capture');

const Session = require('../infra/database/Session');

const CaptureRepository = require('../infra/repositories/CaptureRepository');
const TreeRepository = require('../infra/repositories/TreeRepository');
const TreeTagRepository = require('../infra/repositories/TreeTagRepository');

const treePostSchema = Joi.object({
  latest_capture_id: Joi.string().uuid().required(),
  image_url: Joi.string().uri().required(),
  lat: Joi.number().min(0).max(90).required(),
  lon: Joi.number().min(0).max(180).required(),
  gps_accuracy: Joi.number().integer().required().required(),
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
});

const treePatchSchema = Joi.object({
  latest_capture_id: Joi.string().uuid(),
  image_url: Joi.string().uri(),
  species_id: Joi.string().uuid(),
  morphology: Joi.string(),
  age: Joi.number().integer(),
  status: Joi.string().valid('active', 'deleted'),
}).unknown(false);

const treeIdParamSchema = Joi.object({
  tree_id: Joi.string().uuid().required(),
}).unknown(false);

const treeTagsPostSchema = Joi.object({
  tags: Joi.array().items(Joi.string().uuid()).required().min(1),
}).unknown(false);

const treeTagIdQuerySchema = Joi.object({
  tree_id: Joi.string().uuid().required(),
  tag_id: Joi.string().uuid().required(),
}).unknown(false);

const treeTagPatchSchema = Joi.object({
  status: Joi.string().valid('active', 'deleted'),
}).unknown(false);

const treeHandlerGet = async function (req, res) {
  const session = new Session(false);
  const treeRepo = new TreeRepository(session);
  const executeGetTrees = getTrees(treeRepo);
  const result = await executeGetTrees(req.query);
  res.send(result);
  res.end();
};

const treeHandlerPost = async function (req, res, next) {
  const session = new Session();
  const captureRepo = new TreeRepository(session);
  const executeCreateTree = createTree(captureRepo);

  const tree = treeInsertObject(req.body);
  try {
    await treePostSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    await session.beginTransaction();
    await executeCreateTree(tree);
    await session.commitTransaction();
    res.status(204).send();
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

const treeHandlerGetPotentialMatches = async (req, res) => {
  log.warn('handle potentialMatches');
  const session = new Session();
  const treeRepository = new TreeRepository(session);
  const execute = potentialMatches(treeRepository);
  const potentialTrees = await execute(req.query.capture_id);
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
};

const treeHandlerSingleGet = async (req, res) => {
  await treeIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const treeRepo = new TreeRepository(session);

  const tree = await treeRepo.getById(req.params.tree_id);

  res.send(Tree(tree));
};

const treeHandlerPatch = async (req, res, next) => {
  await treePatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await treeIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const treeRepo = new TreeRepository(session);

  try {
    await session.beginTransaction();
    await treeRepo.update({
      id: req.params.tree_id,
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

const treeHandlerTagGet = async (req, res) => {
  await treeIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const treeTagRepo = new TreeTagRepository(session);

  const executeGetTreeTags = getTreeTags(treeTagRepo);

  const result = await executeGetTreeTags({
    tree_id: req.params.tree_id,
  });

  res.send(result);
};

const treeHandlerTagPost = async function (req, res, next) {
  await treeIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await treeTagsPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const session = new Session();
  const treeTagRepo = new TreeTagRepository(session);

  try {
    await session.beginTransaction();

    const executeAddTagsToTree = addTagsToTree(treeTagRepo);
    await executeAddTagsToTree({
      tags: req.body.tags,
      tree_id: req.params.tree_id,
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

const treeHandlerSingleTagGet = async function (req, res) {
  await treeTagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const treeTagRepo = new TreeTagRepository(session);

  const executeGetTreeTags = getTreeTags(treeTagRepo);

  const result = await executeGetTreeTags({
    capture_id: req.params.capture_id,
    tag_id: req.params.tag_id,
  });

  const [r = {}] = result;

  res.send(r);
};

const treeHandlerSingleTagPatch = async function (req, res, next) {
  await treeTagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await treeTagPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const session = new Session();
  const treeTagRepo = new TreeTagRepository(session);

  try {
    await session.beginTransaction();
    await treeTagRepo.update({
      tree_id: req.params.tree_id,
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
const treeHandlerSingleTagDelete = async function (req, res, next) {
  await treeTagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const treeTagRepo = new TreeTagRepository(session);

  try {
    await session.beginTransaction();
    // confirm if this is to happen or if a soft delete is to happen with status set to deleted
    await treeTagRepo.delete({
      tree_id: req.params.tree_id,
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
  treeHandlerGet,
  treeHandlerPost,
  treeHandlerGetPotentialMatches,
  treeHandlerSingleGet,
  treeHandlerPatch,
  treeHandlerTagGet,
  treeHandlerTagPost,
  treeHandlerSingleTagGet,
  treeHandlerSingleTagPatch,
  treeHandlerSingleTagDelete,
};
