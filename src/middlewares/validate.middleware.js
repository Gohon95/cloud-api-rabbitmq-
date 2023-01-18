const httpStatus = require("http-status");
const Joi = require("joi");
const ApiError = require("../utils/ApiError");
const pick = require("../utils/pick.utils");

const validate = (schema) => {
  return (req, res, next) => {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const dataToValidate = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(dataToValidate);

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    Object.assign(req, value);
    next();
  };
};

module.exports = validate;
