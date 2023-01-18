const app = require("./app");
const config = require("./config/config");
const sequelize = require("./config/db.config");

const server = app.listen(config.port, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to database established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  console.log(`App listening on port ${config.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});
