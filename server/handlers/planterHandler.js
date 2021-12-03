const Joi = require('joi');
const Session = require('../infra/database/Session');
const PlanterRepository = require('../infra/repositories/PlanterRepository');
const { getPlanters } = require('../models/Planter');

const planterQuerySchema = Joi.object({
  organization_id: Joi.string().guid(),
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
});

const planterHandlerGet = async function (req, res) {
  await planterQuerySchema.validateAsync(req.query, { abortEarly: false });
  const session = new Session();
  const planterRepo = new PlanterRepository(session);
  const organization_id = req.query.organization_id;

  const url = `planters${
    organization_id ? `?organization_id=${organization_id}` : ''
  }`;

  const executeGetPlanters = getPlanters(planterRepo);
  const result = await executeGetPlanters(req.query, url);

  res.send(result);
  res.end();
};

module.exports = {
  planterHandlerGet,
};
