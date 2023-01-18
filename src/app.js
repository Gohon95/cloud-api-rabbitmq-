const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("./config/morgan");
const sequelize = require("./config/db.config");

const config = require("./config/config");
const routes = require("./routes");
const {
  errorConverter,
  errorHandler,
} = require("./middlewares/error.middleware");

const app = express();

// logger
if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// politique cors
app.use(cors());

// parsing du body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// import des routes
app.use(routes);

// gestion des erreurs
app.use(errorConverter);
app.use(errorHandler);

// sync and seed the database
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Re-sync db");
    console.log("Database seeded 🤖");
  } catch (err) {
    console.error(err);
  }
})();

module.exports = app;
