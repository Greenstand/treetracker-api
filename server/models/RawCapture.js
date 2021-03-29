const { raiseEvent, DomainEvent } = require('./DomainEvent');
const { Repository } = require('./Repository');

const RawCapture = ({
  id,
  reference_id,
  image_url,
  lat,
  lon,
  gps_accuracy,
  note,
  device_identifier,
  planter_id,
  planter_username,
  planter_photo_url,
  attributes,
  status,
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
    note,
    device_identifier,
    planter_id,
    planter_username,
    planter_photo_url,
    attributes,
    status,
    created_at,
    updated_at,
  });

const rawCaptureFromRequest = ({
  id,
  uuid,
  image_url,
  lat,
  lon,
  gps_accuracy,
  note,
  device_identifier,
  planter_id,
  planter_identifier,
  planter_photo_url,
  attributes,
  timestamp,
}) =>
  Object.freeze({
    id: uuid,
    reference_id: id,
    image_url,
    lat,
    lon,
    gps_accuracy,
    note,
    device_identifier,
    planter_id,
    planter_identifier,
    planter_photo_url,
    attributes,
    created_at: new Date(timestamp).toISOString(),
    updated_at: new Date(timestamp).toISOString(),
  });

const RawCaptureCreated = ({
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
    type: 'RawCaptureCreated',
    lat,
    lon,
    field_user_id,
    field_username,
    attributes,
    created_at,
  });

const VerifyCaptureProcessed = ({
  id,
  reference_id,
  type,
  approved,
  rejection_reason,
  created_at,
}) =>
  Object.freeze({
    id,
    reference_id,
    type,
    approved,
    rejection_reason,
    created_at,
  });

const createRawCapture = (captureRepositoryImpl, eventRepositoryImpl) => async (
  inputRawCapture,
) => {
  // json wrap the 'attributes' array for storage in jsonb (storing array not suppported in jsonb)
  const newRawCapture = {
    ...inputRawCapture,
    status: 'unprocessed',
    attributes: { entries: inputRawCapture.attributes },
  };
  const captureRepository = new Repository(captureRepositoryImpl);
  const rawCapture = await captureRepository.add(newRawCapture);
  const filteredAttr = rawCapture.attributes.entries.filter(
    (attribute) => attribute.key === 'app_flavor',
  );
  const rawCaptureCreated = RawCaptureCreated({
    ...rawCapture,
    attributes: filteredAttr,
  });
  console.log(
    'RAW CAPTURE MODEL createRawCaptures',
    newRawCapture,
    filteredAttr,
    rawCaptureCreated,
  );
  const raiseFieldDataEvent = raiseEvent(eventRepositoryImpl);
  const domainEvent = await raiseFieldDataEvent(DomainEvent(rawCaptureCreated));
  return { entity: rawCapture, raisedEvents: [domainEvent] };
};

const FilterCriteria = ({
  status = undefined,
  field_username = undefined,
  field_user_id = undefined,
}) => {
  return Object.entries({ status, field_username, field_user_id })
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

const getRawCaptures = (captureRepositoryImpl) => async (
  filterCriteria = undefined,
) => {
  let filter = {};
  let options = { limit: 1000, offset: 0 };
  if (filterCriteria !== undefined) {
    filter = FilterCriteria({ ...filterCriteria });
    options = { ...options, ...QueryOptions({ ...filterCriteria }) };
  }
  console.log(
    'RAW CAPTURE MODEL getRawCaptures',
    filterCriteria,
    filter,
    options,
  );
  const captureRepository = new Repository(captureRepositoryImpl);
  const rawCaptures = await captureRepository.getByFilter(filter, options);
  return rawCaptures.map((row) => {
    return RawCapture({ ...row });
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

module.exports = {
  rawCaptureFromRequest,
  createRawCapture,
  getRawCaptures,
  applyVerification,
};
