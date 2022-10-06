const TreeService = require('../../services/TreeService');
const TreeTagService = require('../../services/TreeTagService');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../../utils/helper');
const HttpError = require('../../utils/HttpError');
const {
  treePostSchema,
  treeGetQuerySchema,
  treeTagPatchSchema,
  treeTagIdQuerySchema,
  treeTagsPostSchema,
  treePotentialMatchestSchema,
  treeIdParamSchema,
  treePatchSchema,
} = require('./schemas');

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

  const { tree, status } = await treeService.createTree(treeObject);

  res.status(status).send(tree);
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

  if (!tree?.id)
    throw new HttpError(404, `tree with id ${req.params.tree_id} not found`);

  res.send(tree);
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

  res.send(treeTags);
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

  res.send(treeTag);
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

  res.send(treeTag);
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
