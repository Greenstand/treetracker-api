const express = require('express');

// const Sentry = require('@sentry/node');
const cors = require('cors');
const log = require('loglevel');
const { EventHandlerService } = require('./services/EventHandlerService');
const HttpError = require('./utils/HttpError');
const { errorHandler } = require('./utils/utils');
const helper = require('./utils/utils');
const router = require('./routes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  log.info('disable cors');
  app.use(cors());
}

// Sentry.init({ dsn: config.sentry_dsn });

/*
 * Check request
 */
app.use(
  helper.handlerWrapper(async (req, _res, next) => {
    if (req.path === '/grower_accounts/image' && req.method === 'POST') {
      if (!req.headers['content-type'].includes('multipart/form-data')) {
        throw new HttpError(
          415,
          'Invalid content type. endpoint only supports multipart/form-data',
        );
      }
      return next();
    }
    if (
      req.method === 'POST' ||
      req.method === 'PATCH' ||
      req.method === 'PUT'
    ) {
      if (req.headers['content-type'] !== 'application/json') {
        throw new HttpError(
          415,
          'Invalid content type. API only supports application/json',
        );
      }
    }
    return next();
  }),
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

app.use(errorHandler);

const { version } = require('../package.json');

app.get('*', function (req, res) {
  res.status(200).send(version);
});

const eventHandlerService = new EventHandlerService();
(async () => {
  await eventHandlerService.registerEventHandlers();
})();

module.exports = app;
