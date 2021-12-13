const Joi = require('joi');
const Session = require('../infra/database/Session');
const GroundUserRepository = require('../infra/repositories/GroundUserRepository');
const { getGroundUsers } = require('../models/GroundUser');

const groundUserQuerySchema = Joi.object({
  organization_id: Joi.string().guid(),
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
});

const groundUserHandlerGet = async function (req, res) {
  await groundUserQuerySchema.validateAsync(req.query, { abortEarly: false });
  const session = new Session();
  const groundUserRepo = new GroundUserRepository(session);
  const { organization_id } = req.query;

  const url = `groundUsers${
    organization_id ? `?organization_id=${organization_id}` : ''
  }`;

  const executeGetGroundUsers = getGroundUsers(groundUserRepo);
  const result = await executeGetGroundUsers(req.query, url);

  res.send(result);
  res.end();
};

module.exports = {
  groundUserHandlerGet,
};
