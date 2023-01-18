const morgan = require("morgan");
const config = require("./config");
const logger = require("./logger");
const moment = require("moment");

morgan.token("message", (req, res) => res.locals.errorMessage || "");

morgan.token("date", (req, res, tz) => moment().tz(tz).format());

const getIpFormat = () =>
  config.env === "production" ? ":remote-addr - " : "";
const successResponseFormat = `[:date[Europe/Paris]] ${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `[:date[Europe/Paris]] ${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

module.exports = {
  successHandler,
  errorHandler,
};
