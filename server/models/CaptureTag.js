/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const { v4: uuid } = require('uuid');
const HttpError = require('../utils/HttpError');
const { raiseEvent, DomainEvent } = require('./DomainEvent');
const { PaginationQueryOptions } = require('./helper');
const { Repository } = require('./Repository');

const CaptureTag = ({
  id,
  capture_id,
  tag_id,
  tag_name,
  status,
  created_at,
  updated_at,
}) =>
  Object.freeze({
    id,
    capture_id,
    tag_id,
    tag_name,
    status,
    created_at,
    updated_at,
  });

const captureTagInsertObject = ({ tag_id, capture_id }) =>
  Object.freeze({
    id: uuid(),
    tag_id,
    capture_id,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

const FilterCriteria = ({ capture_id = undefined, tag_id = undefined }) => {
  return Object.entries({ capture_id, tag_id })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const getCaptureTags = (captureTagRepositoryImpl) => async (
  filterCriteria = undefined,
) => {
  const filter = { ...FilterCriteria(filterCriteria) };
  const captureTags = await captureTagRepositoryImpl.getCaptureTags(filter);
  return captureTags.map((row) => CaptureTag({ ...row }));
};

const addTagsToCapture = (captureTagRepositoryImpl) => async ({
  tags,
  capture_id,
}) => {
  const insertObjectArray = await Promise.all(
    tags.map(async (t) => {
      const captureTag = await captureTagRepositoryImpl.getByFilter({
        tag_id: t,
        capture_id,
      });
      if (captureTag.length > 0)
        throw new HttpError(
          400,
          `Tag ${t} has already been assigned to the specified capture`,
        );
      return captureTagInsertObject({ tag_id: t, capture_id });
    }),
  );

  await captureTagRepositoryImpl.create(insertObjectArray);
};

module.exports = {
  getCaptureTags,
  addTagsToCapture,
};
