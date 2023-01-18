const { Sequelize } = require("sequelize");
const config = require("./config");

const databaseUrl =
  config.env !== "test"
    ? `postgres://${config.sequelize.user}:${config.sequelize.password}@${config.sequelize.host}:${config.sequelize.port}/${config.sequelize.database}`
    : `postgres://${config.sequelize.testUser}:${config.sequelize.testPassword}@${config.sequelize.host}:${config.sequelize.port}/${config.sequelize.testDatabase}`;

const sequelize = new Sequelize(databaseUrl, {
  // TODO: changer la timezone
  logging: false,
  define: {
    freezeTableName: true,
    timestamps: false,
    createdAt: "cree_le",
    updatedAt: "modifie_le",
    deletedAt: "supprime_le",
  },
});

module.exports = sequelize;
