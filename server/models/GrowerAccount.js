const { v4: uuid } = require('uuid');
const { PaginationQueryOptions } = require('./helper');

const GrowerAccount = ({
  id,
  wallet_id,
  wallet,
  person_id,
  organization_id,
  name,
  email,
  phone,
  image_url,
  image_rotation,
  status,
  first_registration_at,
  created_at,
  updated_at,
}) =>
  Object.freeze({
    id,
    wallet_id,
    wallet,
    person_id,
    organization_id,
    name,
    email,
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
  name = undefined,
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
    name,
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
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    id: uuid(),
  });

const getGrowerAccounts = (growerAccountRepo) => async (
  filterCriteria,
  url,
) => {
  let options = { limit: 100, offset: 0 };
  options = { ...options, ...PaginationQueryOptions({ ...filterCriteria }) };

  let next = '';
  let prev = '';

  const query = `${url}?limit=${options.limit}&`;

  next = `${query}offset=${+options.offset + +options.limit}`;
  if (options.offset - +options.limit >= 0) {
    prev = `${query}offset=${+options.offset - +options.limit}`;
  }

  const growerAccounts = await growerAccountRepo.getByFilter({}, options);

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

  return;
};

module.exports = {
  getGrowerAccounts,
  GrowerAccountInsertObject,
  updateGrowerAccount,
  GrowerAccount,
};
