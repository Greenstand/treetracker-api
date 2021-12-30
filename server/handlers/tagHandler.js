const Joi = require('joi');
const Session = require('../infra/database/Session');
const TagRepository = require('../infra/repositories/TagRepository');
const { getTags, TagInsertObject, updatetag, Tag } = require('../models/Tag');

const tagGetQuerySchema = Joi.object({
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
}).unknown(false);

const tagPostQuerySchema = Joi.object({
  isPublic: Joi.boolean().required(),
  name: Joi.string().required(),
}).unknown(false);

const TagPatchQuerySchema = Joi.object({
  isPublic: Joi.boolean(),
  status: Joi.string().valid('active', 'deleted'),
}).unknown(false);

const TagIdQuerySchema = Joi.object({
  tag_id: Joi.string().uuid().required(),
});

const tagHandlerGet = async function (req, res) {
  await tagGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });
  const session = new Session();
  const tagRepo = new TagRepository(session);

  const url = `tags`;

  const executeGetTags = getTags(tagRepo);
  const result = await executeGetTags(req.query, url);

  res.send(result);
  res.end();
};

const tagHandlerPost = async function (req, res, next) {
  await tagPostQuerySchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const session = new Session();
  const tagRepo = new TagRepository(session);

  try {
    await session.beginTransaction();
    const tagInsertObject = TagInsertObject(req.body);
    await tagRepo.create(tagInsertObject);

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

const tagHandlerPatch = async function (req, res, next) {
  await TagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await TagPatchQuerySchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const session = new Session();
  const tagRepo = new TagRepository(session);

  try {
    await session.beginTransaction();
    const executeUpdatetag = updatetag(tagRepo);
    await executeUpdatetag({ ...req.body, ...req.params });
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

const tagHandlerSingleGet = async function (req, res) {
  await TagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const tagRepo = new TagRepository(session);

  const tag = await tagRepo.getById(req.params.tag_id);

  res.send(Tag(tag));
};

module.exports = {
  tagHandlerGet,
  tagHandlerPost,
  tagHandlerSingleGet,
  tagHandlerPatch,
};
