const CaptureTagService = require('../../services/CaptureTagService');
const CaptureService = require('../../services/CaptureService');
const HttpError = require('../../utils/HttpError');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../../utils/helper');
const {
  captureGetQuerySchema,
  captureTagPatchSchema,
  captureTagsPostSchema,
  captureTagIdQuerySchema,
  captureIdParamSchema,
  capturePatchSchema,
  capturePostSchema,
} = require('./schemas');

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

  const legacyAPIAuthorizationHeader = req.headers.authorization;

  if (!legacyAPIAuthorizationHeader) {
    throw new HttpError(422, 'legacy authorization header needed');
  }

  const captureService = new CaptureService();
  const { capture, status } = await captureService.createCapture({
    ...captureObject,
    legacyAPIAuthorizationHeader,
  });

  res.status(status).send(capture);
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

  res.send(capture);
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

const captureHandlerTagGet = async function (req, res) {
  await captureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const captureTagService = new CaptureTagService();
  const captureTags = await captureTagService.getCaptureTags({
    capture_id: req.params.capture_id,
  });

  res.send(captureTags);
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

  res.send(captureTag);
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

  res.send(captureTag);
};

module.exports = {
  captureHandlerPost,
  captureHandlerGet,
  captureHandlerPatch,
  captureHandlerSingleGet,
  captureHandlerTagGet,
  captureHandlerTagPost,
  captureHandlerSingleTagGet,
  captureHandlerSingleTagPatch,
};
