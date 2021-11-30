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
  return Object.entries({ limit, offset, order, orderBy: sort_by })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const getPlanters = (planterRepo) => async (filterCriteria, url) => {
  const organization_id = filterCriteria?.organization_id;
  const options = { ...options, ...QueryOptions({ ...filterCriteria }) };

  const queryFilterObjects = { ...filterCriteria };
  queryFilterObjects.limit = options.limit;

  // remove offset property, as it is calculated later
  delete queryFilterObjects.offset;

  const urlWithLimitAndOffset = `${url}?${query}&offset=`;

  const next = `${urlWithLimitAndOffset}${+options.offset + +options.limit}`;
  let prev = null;
  if (options.offset - +options.limit >= 0) {
    prev = `${urlWithLimitAndOffset}${+options.offset - +options.limit}`;
  }

  const planters = organization_id
    ? await planterRepo.getPlantersByOrganization(organization_id, options)
    : await planterRepo.getByFilter(filterCriteria, options);

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
