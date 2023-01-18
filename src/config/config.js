const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envSchema = Joi.object()
  .keys({
    // app config
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),

    // database config
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),

    // test database config
    TEST_DB_USER: Joi.string().required(),
    TEST_DB_PASSWORD: Joi.string().required(),
    TEST_DB_NAME: Joi.string().required(),

    // jwt config
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRE_MINUTES: Joi.string().default(30),
    JWT_REFRESH_EXPIRE_DAYS: Joi.string().default(1),

    // upload config
    UPLOAD_DIR: Joi.string().default("uploads"),

    // docs config
    POSTMAN_FILE: Joi.string().default("src/docs/api.postman_collection.json"),
    SWAGGER_FILE: Joi.string().default("src/docs/swagger.yml"),

    // logging config
    LOGS_FILE: Joi.string().default("logs/combined.log"),
    ERROR_FILE: Joi.string().default("logs/error.log"),
  })
  .unknown();

const { value: env, error } = envSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  // app config
  env: env.NODE_ENV,
  port: env.PORT,
  uploadDirectory: env.UPLOAD_DIR,

  sequelize: {
    // database config
    host: env.DB_HOST,
    port: env.NODE_ENV === "production" ? 5432 : env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,

    // test database config
    testUser: env.TEST_DB_USER,
    testPassword: env.TEST_DB_PASSWORD,
    testDatabase: env.TEST_DB_NAME,
  },

  // jwt config
  jwt: {
    secret: env.JWT_SECRET,
    accessExpirationMinutes: env.JWT_ACCESS_EXPIRE_MINUTES,
    refreshExpirationDays: env.JWT_REFRESH_EXPIRE_DAYS,
  },

  // docs config
  docs: {
    postmanFile: env.POSTMAN_FILE,
    swaggerFile: env.SWAGGER_FILE,
  },

  // logging config
  logger: {
    logsFile: env.LOGS_FILE,
    errorFile: env.ERROR_FILE,
  },
};

module.exports = config;
