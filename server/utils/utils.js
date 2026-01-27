/*
 * Some utils for router/express
 */
const log = require('loglevel');
const { ValidationError } = require('joi');
const { isAxiosError } = require('axios').default;
const HttpError = require('./HttpError');
const JWTService = require('../services/JwtService');
const { POLICIES } = require('./enums');

/*
 * This is from the library https://github.com/Abazhenov/express-async-handler
 * Made some customization for our project. With this, we can throw Error from
 * the handler function or internal function call stack, and parse the error,
 * send to the client with appropriate response (http error code & json body)
 *
 * USAGE: wrap the express handler with this function:
 *
 *  router.get("/xxx", handlerWrap(async (res, rep, next) => {
 *    ...
 *  }));
 *
 *  Then, add the errorHandler below to the express global error handler.
 *
 */
exports.handlerWrapper = (fn) =>
  function wrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch((e) => {
      next(e);
    });
  };

exports.errorHandler = (err, req, res, _next) => {
  if (err instanceof HttpError && err.code !== 500) {
    res.status(err.code).send({
      code: err.code,
      message: err.message,
    });
  } else if (err instanceof ValidationError) {
    res.status(422).send({
      code: 422,
      message: err.details.map((m) => m.message).join(';'),
    });
  } else if (isAxiosError(err)) {
    const errorResponse = err.response?.data;
    const errorObject = {
      microserviceUrl: err.config.url,
      data: err.config.data,
      code: errorResponse?.error?.statusCode || errorResponse?.code || 500,
      message:
        errorResponse?.error?.message ||
        errorResponse?.message ||
        err.response?.error ||
        err.message ||
        `Unknown error occured with external service call`,
    };
    log.warn(errorObject);
    res.status(500).send({
      code: 500,
      message: errorObject.message,
    });
  } else {
    log.error(err);
    res.status(500).send({
      code: 500,
      message: `Internal server error`,
    });
  }
};

exports.verifyJWTHandler = exports.handlerWrapper(async (req, res, next) => {
  const result = await JWTService.verify(req.headers.authorization);
  req.user = { ...result };
  next();
});

exports.hasPermission = (allowedPolicies, allowedRole) =>
  exports.handlerWrapper((req, res, next) => {
    const { policies: userPolicies, organizationId, roles } = req.user;

    if (userPolicies.includes(POLICIES.SUPER_PERMISSION)) {
      return next();
    }
    if (!allowedPolicies?.length) {
      throw new HttpError(500, 'no access control defined for route');
    }

    const permittedViaPolicies = allowedPolicies.some((item) =>
      userPolicies.includes(item),
    );

    if (!permittedViaPolicies) {
      throw new HttpError(401, 'not permitted to access resource');
    }

    if (!organizationId && !roles.includes(allowedRole)) {
      throw new HttpError(401, 'not attached to an organization');
    }

    return next();
  });
