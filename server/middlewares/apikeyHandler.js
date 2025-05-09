const Crypto = require('crypto');
const Session = require('../infra/database/Session');
const ApiKeyRepository = require('../repositories/ApiKeyRepository');
const HttpError = require('../utils/HttpError');
const { handlerWrapper } = require('../utils/utils');

exports.apiKeyHandler = handlerWrapper(async (req, res, next) => {
  const apiKey = req.headers['treetracker-api-key'];
  if (!apiKey) {
    throw new HttpError(401, 'invalid API KEY received');
  }

  const session = new Session();
  const apiKeyRepository = new ApiKeyRepository(session);

  const hash = Crypto.createHmac('sha512', 'treetrcker');
  hash.update(apiKey);
  const value = hash.digest('hex');

  const apiKeyDetails = await apiKeyRepository.getByApiKey(value);

  if (!apiKeyDetails) {
    throw new HttpError(401, 'invalid API KEY received');
  }

  next();
});
