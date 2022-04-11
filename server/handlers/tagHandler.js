const Joi = require('joi');
const TagService = require('../services/TagService');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');

const tagGetQuerySchema = Joi.object({
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
  owner_id: Joi.string(),
}).unknown(false);

const tagPostQuerySchema = Joi.object({
  isPublic: Joi.boolean().required(),
  name: Joi.string().required(),
  owner_id: Joi.string(),
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

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const tagService = new TagService();
  const tags = await tagService.getTags(filter, limitOptions);
  const count = await tagService.getTagsCount(filter);

  const url = 'tags';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    tags,
    links,
    query: { count, ...limitOptions, ...filter },
  });
  res.end();
};

const tagHandlerPost = async function (req, res) {
  await tagPostQuerySchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const tagService = new TagService();
  const createdTag = await tagService.createTag(req.body);

  res.status(201).send(createdTag);
  res.end();
};

const tagHandlerPatch = async function (req, res) {
  await TagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await TagPatchQuerySchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const tagService = new TagService();
  const updatedTag = await tagService.updateTag({
    ...req.body,
    id: req.params.tag_id,
  });

  res.status(200).send(updatedTag);
  res.end();
};

const tagHandlerSingleGet = async function (req, res) {
  await TagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const tagService = new TagService();

  const tag = await tagService.getTagById(req.params.tag_id);

  res.send(tag);
};

module.exports = {
  tagHandlerGet,
  tagHandlerPost,
  tagHandlerSingleGet,
  tagHandlerPatch,
};
