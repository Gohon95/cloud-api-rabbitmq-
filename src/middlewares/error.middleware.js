const httpStatus = require("http-status");
const sequelize = require("sequelize");
const config = require("../config/config");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");

const sequelizeErrorHandler = (err, req) => {
  // check erreur liée à sequelize
  if (!(err instanceof sequelize.Error)) {
    return err;
  }

  // erreur de validation
  if (err instanceof sequelize.ValidationError) {
    return new ApiError(
      httpStatus.BAD_REQUEST,
      err.errors.shift().message,
      true,
      err.stack
    );
  }

  // autre erreur de database
  if (err instanceof sequelize.DatabaseError) {
    return new ApiError(httpStatus.BAD_REQUEST, err.message, true, err.stack);
  }

  return err;
};

const errorConverter = (err, req, res, next) => {
  let error = err;

  // check erreur liée à sequelize
  error = sequelizeErrorHandler(error, req);

  // conversion en ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;

  // dissimulation des informations de l'erreur en production
  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  // construction de la réponse à partir des informations de l'erreur
  const response = {
    code: statusCode,
    message: message,
    ...(config.env !== "production" && { stack: err.stack }),
  };

  // affichage de l'erreur dans la console en développement
  if (config.env === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = { errorConverter, errorHandler };
