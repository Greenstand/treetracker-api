const { v4: uuid } = require('uuid');
const { PaginationQueryOptions } = require('./helper');

const Tag = ({
  id,
  name,
  isPublic,
  status,
  owner_id,
  created_at,
  updated_at,
}) =>
  Object.freeze({
    id,
    name,
    isPublic,
    status,
    owner_id,
    created_at,
    updated_at,
  });

const TagInsertObject = (requestBody) =>
  Object.freeze({
    ...Tag(requestBody),
    id: uuid(),
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

const PropertiesToUpdate = ({
  status = undefined,
  isPublic = undefined,
  tag_id = undefined,
}) => {
  const id = tag_id;
  const updated_at = new Date().toISOString();
  /* eslint-disable no-param-reassign */
  return Object.entries({
    id,
    isPublic,
    status,
    updated_at,
  })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      const [key, value] = item;
      result[key] = value;
      return result;
    }, {});
};

/* eslint-disable no-param-reassign */
const FilterCriteria = ({ name = undefined, owner_id = undefined }) => {
  return Object.entries({ name, owner_id })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      const [key, value] = item;
      result[key] = value;
      return result;
    }, {});
};

const getTags = (tagRepo) => async (filterCriteria, url) => {
  let options = { limit: 100, offset: 0 };
  options = { ...options, ...PaginationQueryOptions({ ...filterCriteria }) };

  const filter = { status: 'active', ...FilterCriteria(filterCriteria) };

  let next = '';
  let prev = '';

  const query = `${url}?limit=${options.limit}&`;

  next = `${query}offset=${+options.offset + +options.limit}`;
  if (options.offset - +options.limit >= 0) {
    prev = `${query}offset=${+options.offset - +options.limit}`;
  }

  const tags = await tagRepo.getByFilter(filter, options);

  return {
    tags: tags.map((row) => Tag(row)),
    links: {
      prev,
      next,
    },
  };
};

const updatetag = (tagRepo) => async (updateObject) => {
  const properties = { ...PropertiesToUpdate({ ...updateObject }) };

  await tagRepo.update(properties);
};

module.exports = {
  getTags,
  TagInsertObject,
  updatetag,
  Tag,
};
