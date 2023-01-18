const dbService = require("../../src/services/db.service");
const Token = require("../../src/models/token.model");
const User = require("../../src/models/user.model");

// TODO: vérifier comment bien intégrer sequelize en environnement de test
const setupTestDB = () => {
  //   beforeAll(async () => {
  //     await sequelize.connect(config.sequelize.url, config.sequelize.options);
  //   });

  beforeEach(async () => {
    await Promise.all([
      // suppression des tokens
      dbService.destroy(Token, {}),
      // suppression des utilisateurs
      dbService.destroy(User, {}),
    ]);
  });

  //   afterAll(async () => {
  //     await sequelize.disconnect();
  //   });
};

module.exports = setupTestDB;
