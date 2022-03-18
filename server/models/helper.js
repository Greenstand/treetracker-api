/* eslint-disable no-param-reassign */
const PaginationQueryOptions = ({ limit = undefined, offset = undefined }) => {
  return Object.entries({ limit, offset })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      const [key, value] = item;
      result[key] = value;
      return result;
    }, {});
};

module.exports = {
  PaginationQueryOptions,
};
