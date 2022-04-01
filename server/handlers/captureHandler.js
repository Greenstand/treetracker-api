const Joi = require('joi');

const CaptureTagService = require('../services/CaptureTagService');
const CaptureService = require('../services/CaptureService');
const HttpError = require('../utils/HttpError');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');

const capturePostSchema = Joi.object({
  id: Joi.string().uuid().required(),
  session_id: Joi.string().uuid().required(),
  image_url: Joi.string().uri().required(),
  lat: Joi.number().required().min(-90).max(90).required(),
  lon: Joi.number().required().min(-180).max(180).required(),
  gps_accuracy: Joi.number().integer().required(),
  grower_account_id: Joi.string().uuid().required(),
  planting_organization_id: Joi.string().uuid().required(),
  device_configuration_id: Joi.string().uuid().required(),
  reference_id: Joi.number().integer().default(null),
  tree_id: Joi.string().uuid().default(null),
  note: Joi.string().default(null),
  species_id: Joi.string().uuid().default(null),
  morphology: Joi.string().default(null),
  age: Joi.number().integer().default(null),
  captured_at: Joi.date().iso().required(),
  attributes: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required().allow(''),
      }),
    )
    .allow(null)
    .default(null),
  domain_specific_data: Joi.object().default(null),
}).unknown(false);

const captureGetQuerySchema = Joi.object({
  tree_id: Joi.string().uuid(),
  tree_associated: Joi.boolean(),
  organization_ids: Joi.array().items(Joi.string().uuid()),
  captured_at_start_date: Joi.date().iso(),
  captured_at_end_date: Joi.date().iso(),
  grower_account_id: Joi.string().uuid(),
  species_id: Joi.string().uuid(),
  order_by: Joi.string().valid('captured_at', 'created_at'),
  order: Joi.string().valid('asc', 'desc'),
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
});

const capturePatchSchema = Joi.object({
  tree_id: Joi.string(),
  status: Joi.string(),
}).unknown(false);

const captureIdParamSchema = Joi.object({
  capture_id: Joi.string().uuid().required(),
}).unknown(true);

const captureTagIdQuerySchema = Joi.object({
  capture_id: Joi.string().uuid().required(),
  tag_id: Joi.string().uuid().required(),
}).unknown(true);

const captureTagsPostSchema = Joi.object({
  tags: Joi.array().items(Joi.string().uuid()).required().min(1),
}).unknown(false);

const captureTagPatchSchema = Joi.object({
  status: Joi.string().valid('active', 'deleted'),
}).unknown(false);

const captureHandlerGet = async function (req, res) {
  await captureGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const captureService = new CaptureService();
  const captures = await captureService.getCaptures(filter, limitOptions);
  const count = await captureService.getCapturesCount(filter);

  const url = 'captures';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    captures,
    links,
    query: { count, ...limitOptions, ...filter },
  });
  res.end();
};

const captureHandlerPost = async function (req, res) {
  const captureObject = await capturePostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const captureService = new CaptureService();
  const { capture, status } = await captureService.createCapture(captureObject);

  res.status(status).send({ capture });
};

const captureHandlerPatch = async function (req, res) {
  await capturePatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await captureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const captureService = new CaptureService();
  const capture = await captureService.updateCapture({
    id: req.params.capture_id,
    ...req.body,
  });

  res.send({ capture });
};

const captureHandlerSingleGet = async function (req, res) {
  await captureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const captureService = new CaptureService();

  const capture = await captureService.getCaptureById(req.params.capture_id);

  if (!capture.id)
    throw new HttpError(
      404,
      `capture with id ${req.params.capture_id} not found`,
    );

  res.send(capture);
};

const captureHanglerTagGet = async function (req, res) {
  await captureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const captureTagService = new CaptureTagService();
  const captureTags = await captureTagService.getCaptureTags({
    capture_id: req.params.capture_id,
  });

  res.send({ capture_tags: captureTags });
  res.end();
};

const captureHandlerTagPost = async function (req, res) {
  await captureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await captureTagsPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const captureTagService = new CaptureTagService();
  await captureTagService.addTagsToCapture({
    tags: req.body.tags,
    capture_id: req.params.capture_id,
  });

  res.status(204).send();
  res.end();
};

const captureHandlerSingleTagGet = async function (req, res) {
  await captureTagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const captureTagService = new CaptureTagService();

  const captureTags = await captureTagService.getCaptureTags({
    capture_id: req.params.capture_id,
    tag_id: req.params.tag_id,
  });

  const [captureTag] = captureTags;

  if (!captureTag) throw new HttpError(404, 'Capture Tag not found');

  res.send({ capture_tag: captureTag });
};

const captureHandlerSingleTagPatch = async function (req, res) {
  await captureTagIdQuerySchema.validateAsync(req.params, {
    abortEarly: false,
  });

  await captureTagPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const captureTagService = new CaptureTagService();
  const captureTag = await captureTagService.updateCaptureTag({
    capture_id: req.params.capture_id,
    tag_id: req.params.tag_id,
    ...req.body,
  });

  res.send({ capture_tag: captureTag });
};

module.exports = {
  captureHandlerPost,
  captureHandlerGet,
  captureHandlerPatch,
  captureHandlerSingleGet,
  captureHanglerTagGet,
  captureHandlerTagPost,
  captureHandlerSingleTagGet,
  captureHandlerSingleTagPatch,
};
