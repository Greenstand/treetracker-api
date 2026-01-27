const express = require('express');
const swaggerUi = require('swagger-ui-express');
const log = require('loglevel');
const cors = require('cors');
const { join } = require('path');

// const Sentry = require('@sentry/node');
const { EventHandlerService } = require('./services/EventHandlerService');
const {
  errorHandler,
  handlerWrapper,
  verifyJWTHandler,
} = require('./utils/utils');
const swaggerDocument = require('./handlers/swaggerDoc');
const HttpError = require('./utils/HttpError');
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
  handlerWrapper(async (req, _res, next) => {
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

const options = {
  customCss: `
    .topbar-wrapper img { 
      content:url('../assets/greenstand.webp');
      width:80px; 
      height:auto;
    }
    `,
  explorer: true,
};

app.use('/assets', express.static(join(__dirname, '..', '/assets')));

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});
app.use('/', verifyJWTHandler, router);

app.use(errorHandler);

const eventHandlerService = new EventHandlerService();
(async () => {
  await eventHandlerService.registerEventHandlers();
})();

module.exports = app;
