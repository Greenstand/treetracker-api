const Planter = ({
  id,
  first_name,
  last_name,
  email,
  organization,
  phone,
  pwd_reset_required,
  image_url,
  person_id,
  ordanization_id,
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
    ordanization_id,
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

const getPlanters = (planterRepo) => async (filterCriteria, url) => {
  const organization_id = filterCriteria?.organization_id;
  const filter = { ...filterCriteria };
  delete filter.limit;
  delete filter.offset;
  let options = { ...QueryOptions({ ...filterCriteria }) };

  if (!filterCriteria.limit && !organization_id) {
    options = { ...options, limit: 100, offset: 0 };
  }

  let query = `${url}?`;
  let next = '';
  let prev = '';

  if (options.limit) {
    query = query + 'limit=' + options.limit + '&';
  }

  if (options.offset || options.offset === 0) {
    next = `${query}offset=${+options.offset + +options.limit}`;
    if (options.offset - +options.limit >= 0) {
      prev = `${query}offset=${+options.offset - +options.limit}`;
    }
  }

  const planters = organization_id
    ? await planterRepo.getPlantersByOrganization(organization_id, options)
    : await planterRepo.getByFilter(filter, options);

  return {
    planters: planters.map((row) => Planter(row)),
    links: {
      prev,
      next,
    },
  };
};

module.exports = {
  getPlanters,
};
