const Joi = require('joi');

const TreeService = require('../services/TreeService');
const TreeTagService = require('../services/TreeTagService');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../utils/helper');
const HttpError = require('../utils/HttpError');

const treePostSchema = Joi.object({
  id: Joi.string().uuid().required(),
  latest_capture_id: Joi.string().uuid().required(),
  image_url: Joi.string().uri().required(),
  lat: Joi.number().min(0).max(90).required(),
  lon: Joi.number().min(0).max(180).required(),
  gps_accuracy: Joi.number().integer().required().required(),
  species_id: Joi.string().uuid().default(null),
  morphology: Joi.string().default(null),
  age: Joi.number().integer().default(null),
  attributes: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required().allow(''),
      }),
    )
    .allow(null)
    .default(null),
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

const treePotentialMatchestSchema = Joi.object({
  capture_id: Joi.string().uuid().required(),
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

const treeGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
});

const treeHandlerGet = async function (req, res) {
  await treeGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const treeService = new TreeService();
  const trees = await treeService.getTrees(filter, limitOptions);
  const count = await treeService.getTreesCount(filter);

  const url = 'trees';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    trees,
    links,
    query: { count, ...limitOptions, ...filter },
  });
  res.end();
};

const treeHandlerPost = async function (req, res) {
  const treeObject = await treePostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const treeService = new TreeService();

  const tree = await treeService.createTag(treeObject);

  res.send({ tree });
};

const treeHandlerGetPotentialMatches = async (req, res) => {
  await treePotentialMatchestSchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const treeService = new TreeService();
  const matches = await treeService.getPotentialMatches(req.query.capture_id);

  res.status(200).json({ matches });
};

const treeHandlerSingleGet = async (req, res) => {
  await treeIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const treeService = new TreeService();

  const tree = await treeService.getTreeById(req.params.tree_id);

  if (!tree.id)
    throw new HttpError(404, `tree with id ${req.params.tree_id} not found`);

  res.send({ tree });
};

const treeHandlerPatch = async (req, res) => {
  await treePatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await treeIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const treeService = new TreeService();

  const tree = await treeService.updateTree({
    ...req.body,
    id: req.params.tree_id,
  });

  res.send(tree);
};

const treeHandlerTagGet = async (req, res) => {
  await treeIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const treeTagService = new TreeTagService();

  const treeTags = await treeTagService.getTreeTags({
    tree_id: req.params.tree_id,
  });

  res.send({ tree_tags: treeTags });
};

const treeHandlerTagPost = async function (req, res) {
  await treeIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await treeTagsPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const treeTagService = new TreeTagService();

  await treeTagService.addTagsToTree({
    tags: req.body.tags,
    tree_id: req.params.tree_id,
  });

  res.status(204).send();
};

const treeHandlerSingleTagGet = async function (req, res) {
  await treeTagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const treeTagService = new TreeTagService();

  const treeTags = await treeTagService.getTreeTags({
    tree_id: req.params.tree_id,
    tag_id: req.params.tag_id,
  });

  const [treeTag] = treeTags;

  if (!treeTag) throw new HttpError(404, 'Tree Tag not found');

  res.send({ tree_tag: treeTag });
};

const treeHandlerSingleTagPatch = async function (req, res) {
  await treeTagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await treeTagPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const treeTagService = new TreeTagService();

  const treeTag = await treeTagService.updateTreeTag({
    tree_id: req.params.tree_id,
    tag_id: req.params.tag_id,
    ...req.body,
  });

  res.send({ tree_tag: treeTag });
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
};
