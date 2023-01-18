const server = require("../../src/app.js");
const supertest = require("supertest");
const setupTestDB = require("../utils/setupTestDB.js");

const {
  userOne,
  userTwo,
  insertUsers,
} = require("../fixtures/user.fixture.js");
const { userOneAccessToken } = require("../fixtures/token.fixture.js");

const requestWithSupertest = supertest(server);

setupTestDB();

describe("Auth Endpoints", () => {
  describe("POST /auth/connexion", () => {
    beforeEach(async () => {
      // ajout de l'utilisateur userOne avec lequel tester la connexion
      await insertUsers([userOne]);
    });

    test("should return 200 and the logged in user if data is ok", async () => {
      const userData = {
        email: userOne.email,
        password: userOne.password,
      };

      const res = await requestWithSupertest
        .post("/auth/connexion")
        .send(userData);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("user");
      expect(res.body).toHaveProperty("access");
      expect(res.body).toHaveProperty("refresh");
    });

    test("should return 401 if email does not exist", async () => {
      const userData = {
        email: "bad@email.com",
        password: userOne.password,
      };

      const res = await requestWithSupertest
        .post("/auth/connexion")
        .send(userData);
      expect(res.status).toEqual(401);
      expect(res.body.message).toBe("Invalid email");
    });

    test("should return 401 if password is wrong", async () => {
      const userData = {
        email: userOne.email,
        password: "badpassword",
      };

      const res = await requestWithSupertest
        .post("/auth/connexion")
        .send(userData);
      expect(res.status).toEqual(401);
      expect(res.body.message).toBe("Invalid password");
    });

    test("should return 400 if body is empty", async () => {
      const userData = {};

      const res = await requestWithSupertest
        .post("/auth/connexion")
        .send(userData);
      expect(res.status).toEqual(400);
      expect(res.body.message).toBe(
        '"email" is required, "password" is required'
      );
    });
  });

  describe("GET /auth/deconnexion", () => {
    beforeEach(async () => {
      // ajout de l'utilisateur userOne avec lequel tester la déconnexion
      await insertUsers([userOne]);
    });

    test("should return 200 and log out the user", async () => {
      const res = await requestWithSupertest
        .get("/auth/deconnexion")
        .set("Authorization", `Bearer ${userOneAccessToken}`);
      expect(res.status).toEqual(200);
      expect(res.body.message).toBe("Logged out successfully");
    });

    test("should return 401 if user not authenticated", async () => {
      const res = await requestWithSupertest.get("/auth/deconnexion");
      expect(res.status).toEqual(401);
      expect(res.body.message).toBe("Please authenticate");
    });
  });
});
