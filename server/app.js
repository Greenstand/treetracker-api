const express = require('express');
const Sentry = require('@sentry/node');
const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const HttpError = require('./utils/HttpError');
const { errorHandler } = require('./routes/utils');
const log = require('loglevel');
const helper = require('./routes/utils');
const captureRouter = require('./routes/captureRouter');

const app = express();

//Sentry.init({ dsn: config.sentry_dsn });

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

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json

app.use('/captures', captureRouter);

// Global error handler
app.use(errorHandler);

const version = require('../package.json').version;
app.get('*', function (req, res) {
  res.status(200).send(version);
});

module.exports = app;
