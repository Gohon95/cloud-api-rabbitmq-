const winston = require("winston");
const config = require("./config");

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
    ,
    new winston.transports.File({
      filename: config.logger.logsFile,
      level: "info",
      format: winston.format.uncolorize(),
    }),
    new winston.transports.File({
      filename: config.logger.errorFile,
      level: "error",
      format: winston.format.uncolorize(),
    }),
  ],
});

module.exports = logger;
