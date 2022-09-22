const axios = require('axios').default;

const TREETRACKER_LEGACY_API_URL =
  process.env.TREETRACKER_LEGACY_API_URL ||
  'http://treetracker-admin-api.admin-api';

const organizationRoute = (id) => (id ? `organization/${id}/` : ``);

const approveLegacyTree = async ({
  id,
  morphology,
  age,
  captureApprovalTag,
  speciesId,
  legacyAPIAuthorizationHeader,
  organizationId,
}) => {
  await axios.patch(
    `${TREETRACKER_LEGACY_API_URL}/api/${organizationRoute(
      organizationId,
    )}trees/${id}`,
    {
      id,
      approved: true,
      active: true,
      ...(morphology && { morphology }),
      ...(age && { age }),
      ...(captureApprovalTag && { captureApprovalTag }),
      ...(speciesId && { speciesId }),
    },
    {
      headers: {
        authorization: legacyAPIAuthorizationHeader,
      },
    },
  );
};

module.exports = {
  approveLegacyTree,
};
