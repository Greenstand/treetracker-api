const express = require('express');
// const Sentry = require('@sentry/node');
const cors = require('cors');
const log = require('loglevel');
const HttpError = require('./utils/HttpError');
const { errorHandler } = require('./handlers/utils');
const helper = require('./handlers/utils');
const router = require('./routes');
const registerEventHandlers = require('./services/EventHandlers');

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
    next();
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

registerEventHandlers();

module.exports = app;
