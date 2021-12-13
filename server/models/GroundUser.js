const GroundUser = ({
  id,
  first_name,
  last_name,
  email,
  organization,
  phone,
  pwd_reset_required,
  image_url,
  person_id,
  organization_id,
  image_rotation,
}) => {
  return Object.freeze({
    id,
    first_name,
    last_name,
    email,
    organization,
    phone,
    pwd_reset_required,
    image_url,
    person_id,
    organization_id,
    image_rotation,
  });
};

const QueryOptions = ({ limit = undefined, offset = undefined }) => {
  return Object.entries({ limit, offset })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const getGroundUsers = (groundUserRepo) => async (filterCriteria, url) => {
  const organization_id = filterCriteria?.organization_id;
  const filter = { ...filterCriteria };
  delete filter.limit;
  delete filter.offset;
  let options = { ...QueryOptions({ ...filterCriteria }) };

  if (!filterCriteria?.limit && !organization_id) {
    options = { ...options, limit: 100, offset: 0 };
  }

  if (!filterCriteria?.limit && organization_id) {
    options = {};
  }

  let query = `${url}?`;
  let next = '';
  let prev = '';

  if (options.limit) {
    query = `${query}limit=${options.limit}&`;
  }

  if (options.offset || options.offset === 0) {
    next = `${query}offset=${+options.offset + +options.limit}`;
    if (options.offset - +options.limit >= 0) {
      prev = `${query}offset=${+options.offset - +options.limit}`;
    }
  }

  const groundUsers = organization_id
    ? await groundUserRepo.getGroundUsersByOrganization(
        organization_id,
        options,
      )
    : await groundUserRepo.getByFilter(filter, options);

  return {
    groundUsers: groundUsers.map((row) => GroundUser(row)),
    links: {
      prev,
      next,
    },
  };
};

module.exports = {
  getGroundUsers,
  QueryOptions,
  GroundUser,
};
