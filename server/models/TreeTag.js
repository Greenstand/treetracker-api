/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const { v4: uuid } = require('uuid');
const HttpError = require('../utils/HttpError');

const TreeTag = ({
  id,
  tree_id,
  tag_id,
  tag_name,
  status,
  created_at,
  updated_at,
}) =>
  Object.freeze({
    id,
    tree_id,
    tag_id,
    tag_name,
    status,
    created_at,
    updated_at,
  });

const treeTagInsertObject = ({ tag_id, tree_id }) =>
  Object.freeze({
    id: uuid(),
    tag_id,
    tree_id,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

const FilterCriteria = ({ tree_id = undefined, tag_id = undefined }) => {
  return Object.entries({ tree_id, tag_id })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const getTreeTags = (treeTagRepositoryImpl) => async (
  filterCriteria = undefined,
) => {
  const filter = { ...FilterCriteria(filterCriteria) };
  const treeTags = await treeTagRepositoryImpl.getTreeTags(filter);
  return treeTags.map((row) => TreeTag({ ...row }));
};

const addTagsToTree = (treeTagRepositoryImpl) => async ({ tags, tree_id }) => {
  const insertObjectArray = await Promise.all(
    tags.map(async (t) => {
      const treeTag = await treeTagRepositoryImpl.getByFilter({
        tag_id: t,
        tree_id,
      });
      if (treeTag.length > 0)
        throw new HttpError(
          400,
          `Tag ${t} has already been assigned to the specified tree`,
        );
      return treeTagInsertObject({ tag_id: t, tree_id });
    }),
  );

  await treeTagRepositoryImpl.create(insertObjectArray);
};

module.exports = {
  getTreeTags,
  addTagsToTree,
};
