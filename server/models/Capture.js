/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const { raiseEvent, DomainEvent } = require('./DomainEvent');
const { Repository } = require('./Repository');

const Capture = ({
  id,
  reference_id,
  image_url,
  lat,
  lon,
  gps_accuracy,
  device_identifier,
  planter_id,
  planter_username,
  planter_photo_url,
  attributes,
  status,
  note,
  morphology,
  age,
  created_at,
  updated_at,
}) =>
  Object.freeze({
    id,
    reference_id,
    image_url,
    lat,
    lon,
    gps_accuracy,
    device_identifier,
    planter_id,
    planter_username,
    planter_photo_url,
    attributes,
    status,
    note,
    morphology,
    age,
    created_at,
    updated_at,
  });

const captureFromRequest = ({
  id,
  reference_id,
  image_url,
  estimated_geometric_location,
  lat,
  lon,
  planter_id,
  planter_photo_url,
  planter_username,
  device_identifier,
  attributes,
  status,
  note,
  morphology,
  age,
  created_at,
  updated_at,
}) =>
  Object.freeze({
    id,
    reference_id,
    image_url,
    estimated_geometric_location,
    lat,
    lon,
    planter_id,
    planter_photo_url,
    planter_username,
    device_identifier,
    attributes,
    status,
    note,
    morphology,
    age,
    created_at,
    updated_at,
  });

const CaptureCreated = ({
  id,
  lat,
  lon,
  field_user_id,
  field_username,
  attributes,
  created_at,
}) =>
  Object.freeze({
    id,
    type: 'CaptureCreated',
    lat,
    lon,
    field_user_id,
    field_username,
    attributes,
    created_at,
  });

const createCapture = (captureRepositoryImpl, eventRepositoryImpl) => async (
  inputCapture,
) => {
  // json wrap the 'attributes' array for storage in jsonb (storing array not suppported in jsonb)
  const newCapture = {
    ...inputCapture,
    status: 'approved',
    attributes: { entries: inputCapture.attributes },
  };
  const captureRepository = new Repository(captureRepositoryImpl);
  const capture = await captureRepository.add(newCapture);
  const captureCreated = CaptureCreated({
    ...capture,
  });

  const raiseCaptureEvent = raiseEvent(eventRepositoryImpl);
  const domainEvent = await raiseCaptureEvent(DomainEvent(captureCreated));
  return { entity: capture, raisedEvents: [domainEvent] };
};

const FilterCriteria = ({ tree_id = undefined }) => {
  return Object.entries({ tree_id })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const QueryOptions = ({ limit = undefined, offset = undefined }) => {
  return Object.entries({ limit, offset })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const getCaptures = (captureRepositoryImpl) => async (
  filterCriteria = undefined,
) => {
  let filter = {};
  let options = { limit: 1000, offset: 0 };
  if (filterCriteria !== undefined) {
    filter = FilterCriteria({ ...filterCriteria });
    options = { ...options, ...QueryOptions({ ...filterCriteria }) };
  }
  // console.log('CAPTURE MODEL getCaptures', filterCriteria, filter, options);
  const captureRepository = new Repository(captureRepositoryImpl);
  const captures = await captureRepository.getByFilter(filter, options);
  return captures.map((row) => {
    return Capture({ ...row });
  });
};

const applyVerification = (captureRepositoryImpl) => async (
  verifyCaptureProcessed,
) => {
  if (verifyCaptureProcessed.approved) {
    await captureRepositoryImpl.update({
      id: verifyCaptureProcessed.id,
      status: 'approved',
    });
  } else {
    await captureRepositoryImpl.update({
      id: verifyCaptureProcessed.id,
      status: 'rejected',
      rejection_reason: verifyCaptureProcessed.rejection_reason,
    });
  }
};

const updateCapture = (captureRepositoryImpl) => async (update_object) => {
  return captureRepositoryImpl.update(update_object);
};

module.exports = {
  captureFromRequest,
  createCapture,
  getCaptures,
  applyVerification,
  updateCapture,
};
