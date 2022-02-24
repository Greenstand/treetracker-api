const { v4: uuid } = require('uuid');
const { PaginationQueryOptions } = require('./helper');
const knex = require('../../database/connection');

const GrowerAccount = ({
  id,
  wallet,
  person_id,
  organization_id,
  first_name,
  last_name,
  email,
  phone,
  lat,
  lon,
  location,
  image_url,
  image_rotation,
  status,
  first_registration_at,
  created_at,
  updated_at,
}) =>
  Object.freeze({
    id,
    wallet,
    person_id,
    organization_id,
    first_name,
    last_name,
    email,
    lat,
    lon,
    location,
    phone,
    image_url,
    image_rotation,
    status,
    first_registration_at,
    created_at,
    updated_at,
  });

const PropertiesToUpdate = ({
  grower_account_id = undefined,
  person_id = undefined,
  organization_id = undefined,
  first_name = undefined,
  last_name = undefined,
  email = undefined,
  phone = undefined,
  image_url = undefined,
  status = undefined,
  image_rotation = undefined,
}) => {
  const id = grower_account_id;
  const updated_at = new Date().toISOString();
  return Object.entries({
    id,
    person_id,
    organization_id,
    first_name,
    last_name,
    email,
    phone,
    image_url,
    image_rotation,
    status,
    updated_at,
  })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const GrowerAccountInsertObject = (requestBody) =>
  Object.freeze({
    ...GrowerAccount(requestBody),
    id: uuid(),
    status: 'active',
    location: knex.raw(
      `ST_PointFromText('POINT( ${requestBody.lon} ${requestBody.lat}) ', 4326)`,
    ),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

const FilterCriteria = ({
  organization_id = undefined,
  id = undefined,
  wallet = undefined,
}) => {
  return Object.entries({ organization_id, id, wallet })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const getGrowerAccounts = (growerAccountRepo) => async (
  filterCriteria,
  url,
) => {
  let options = { limit: 100, offset: 0 };
  options = { ...options, ...PaginationQueryOptions({ ...filterCriteria }) };

  const filter = { status: 'active', ...FilterCriteria({ ...filterCriteria }) };

  let next = '';
  let prev = '';

  const query = `${url}?limit=${options.limit}&`;

  next = `${query}offset=${+options.offset + +options.limit}`;
  if (options.offset - +options.limit >= 0) {
    prev = `${query}offset=${+options.offset - +options.limit}`;
  }

  const growerAccounts = await growerAccountRepo.getByFilter(filter, options);

  return {
    grower_accounts: growerAccounts.map((row) => GrowerAccount(row)),
    links: {
      prev,
      next,
    },
  };
};

const updateGrowerAccount = (growerAccountRepo) => async (updateObject) => {
  const properties = { ...PropertiesToUpdate({ ...updateObject }) };

  await growerAccountRepo.update(properties);
};

module.exports = {
  getGrowerAccounts,
  GrowerAccountInsertObject,
  updateGrowerAccount,
  GrowerAccount,
};
