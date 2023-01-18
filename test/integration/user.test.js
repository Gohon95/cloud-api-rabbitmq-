const server = require("../../src/app.js");
const supertest = require("supertest");
const setupTestDB = require("../utils/setupTestDB.js");
const { v4: uuidv4 } = require("uuid");

const {
  adminAccessToken,
  userOneAccessToken,
} = require("../fixtures/token.fixture.js");
const {
  admin,
  insertUsers,
  userOne,
  userTwo,
} = require("../fixtures/user.fixture.js");

const requestWithSupertest = supertest(server);

setupTestDB();

describe("User routes", () => {
  // créer un utilisateur
  describe("POST /user", () => {
    beforeEach(async () => {
      // ajout des utilisateurs userOne et admin
      await insertUsers([userOne, admin]);
    });

    test("should return 200 and successfully create new user if data is ok", async () => {
      const userData = {
        pseudo: userTwo.pseudo,
        email: userTwo.email,
        password: userTwo.password,
      };

      const res = await requestWithSupertest
        .post("/user")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(userData);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        id: expect.anything(),
        role: "user",
        isDeleted: false,
        isEmailVerified: false,
        pseudo: userTwo.pseudo,
        email: userTwo.email,
        updatedAt: expect.anything(),
        createdAt: expect.anything(),
      });
    });

    test("should return 400 if user already exists", async () => {
      const userData = {
        pseudo: userOne.pseudo,
        email: userOne.email,
        password: userOne.password,
      };

      const res = await requestWithSupertest
        .post("/user")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(userData);
      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual("pseudo must be unique");
    });

    test("should return 401 if user is not authenticated", async () => {
      const userData = {
        pseudo: userOne.pseudo,
        email: userOne.email,
        password: userOne.password,
      };

      const res = await requestWithSupertest.post("/user").send(userData);
      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual("Please authenticate");
    });

    test("should return 400 if any required parameter is missing", async () => {
      const userData = {};

      const res = await requestWithSupertest
        .post("/user")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(userData);
      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(
        '"pseudo" is required, "email" is required, "password" is required'
      );
    });

    test("should return 403 if user is not admin", async () => {
      const userData = {
        pseudo: userTwo.pseudo,
        email: userTwo.email,
        password: userTwo.password,
      };

      const res = await requestWithSupertest
        .post("/user")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .send(userData);
      expect(res.status).toEqual(403);
      expect(res.body.message).toEqual("You have no access to this resource");
    });
  });

  // récupérer un utilisateur
  describe("GET /user/:id", () => {
    beforeEach(async () => {
      // ajout des utilisateurs
      await insertUsers([admin, userOne, userTwo]);
    });

    test("should return 200 and the asked user as an admin", async () => {
      const res = await requestWithSupertest
        .get(`/user/${userTwo.id}`)
        .set("Authorization", `Bearer ${adminAccessToken}`);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        id: expect.anything(),
        role: "user",
        isDeleted: false,
        isEmailVerified: false,
        pseudo: userTwo.pseudo,
        email: userTwo.email,
        updatedAt: expect.anything(),
        createdAt: expect.anything(),
      });
    });

    test("should return 200 and the asked user as a user", async () => {
      const res = await requestWithSupertest
        .get(`/user/${userTwo.id}`)
        .set("Authorization", `Bearer ${userOneAccessToken}`);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        id: expect.anything(),
        role: "user",
        isDeleted: false,
        isEmailVerified: false,
        pseudo: userTwo.pseudo,
        email: userTwo.email,
        updatedAt: expect.anything(),
        createdAt: expect.anything(),
      });
    });

    test("should return 404 if user does not exist", async () => {
      const res = await requestWithSupertest
        .get(`/user/${uuidv4()}`)
        .set("Authorization", `Bearer ${adminAccessToken}`);
      expect(res.status).toEqual(404);
      expect(res.body.message).toEqual("User not found");
    });

    test("should return 400 if a bad id format is passed", async () => {
      const res = await requestWithSupertest
        .get("/user/bad_id123")
        .set("Authorization", `Bearer ${adminAccessToken}`);
      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(
        'invalid input syntax for type uuid: "bad_id123"'
      );
    });

    test("should return 404 if any required parameter is missing", async () => {
      const res = await requestWithSupertest
        .get("/user")
        .set("Authorization", `Bearer ${adminAccessToken}`);
      expect(res.status).toEqual(404);
    });
  });

  // récupérer tous les utilisateurs
  describe("POST /user/all", () => {
    beforeEach(async () => {
      // ajout des utilisateurs
      await insertUsers([admin, userOne, userTwo]);
    });

    test("should return 200 and the list of users as an admin", async () => {
      const res = await requestWithSupertest
        .post("/user/all")
        .set("Authorization", `Bearer ${adminAccessToken}`);
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);
    });

    test("should return 200 and the list of users as a user", async () => {
      const res = await requestWithSupertest
        .post("/user/all")
        .set("Authorization", `Bearer ${userOneAccessToken}`);
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);
    });

    test("should return 200 and the list of users in alphabetical order desc", async () => {
      const body = {
        options: {
          order: [["pseudo", "DESC"]],
        },
      };

      const res = await requestWithSupertest
        .post("/user/all")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .send(body);
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);

      const users = res.body;
      expect(users[0].pseudo).toEqual("userTwo");
      expect(users[1].pseudo).toEqual("userOne");
      expect(users[2].pseudo).toEqual("adminOne");
    });

    test("should return 200 and the list of users in alphabetical order asc", async () => {
      const body = {
        options: {
          order: [["pseudo", "ASC"]],
        },
      };

      const res = await requestWithSupertest
        .post("/user/all")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .send(body);
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);

      const users = res.body;
      expect(users[0].pseudo).toEqual("adminOne");
      expect(users[1].pseudo).toEqual("userOne");
      expect(users[2].pseudo).toEqual("userTwo");
    });

    test("should return 200 and the list of admins only", async () => {
      const body = {
        query: {
          role: "admin",
        },
      };

      const res = await requestWithSupertest
        .post("/user/all")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .send(body);
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(1);
    });

    test("should return 404 if no user were found", async () => {
      const body = {
        query: {
          pseudo: "Not Created User",
        },
      };
      const res = await requestWithSupertest
        .post("/user/all")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .send(body);
      expect(res.status).toEqual(404);
      expect(res.body.message).toEqual("No user found");
    });

    test("should return 401 if user is not authenticated", async () => {
      const res = await requestWithSupertest.post("/user/all");
      expect(res.status).toEqual(401);
    });
  });

  // modifier un utilisateur
  describe("PATCH /user/:id", () => {
    beforeEach(async () => {
      // ajout des utilisateurs
      await insertUsers([admin, userOne]);
    });

    test("should return 200 and the updated user", async () => {
      const dataToUpdate = {
        pseudo: "Updated Pseudo",
      };

      const res = await requestWithSupertest
        .patch(`/user/${userOne.id}`)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(dataToUpdate);
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0]).toEqual({
        id: expect.anything(),
        role: "user",
        isDeleted: false,
        isEmailVerified: false,
        pseudo: "Updated Pseudo",
        email: userOne.email,
        updatedAt: expect.anything(),
        createdAt: expect.anything(),
      });
    });

    test("should return 403 if user is not admin", async () => {
      const dataToUpdate = {
        pseudo: "Updated Pseudo",
      };

      const res = await requestWithSupertest
        .patch(`/user/${userOne.id}`)
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .send(dataToUpdate);
      expect(res.status).toEqual(403);
      expect(res.body.message).toEqual("You have no access to this resource");
    });

    test("should return 401 if user is not authenticated", async () => {
      const dataToUpdate = {
        pseudo: "Updated Pseudo",
      };

      const res = await requestWithSupertest
        .patch(`/user/${userOne.id}`)
        .send(dataToUpdate);
      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual("Please authenticate");
    });

    test("should return 404 if user is not found", async () => {
      const dataToUpdate = {
        pseudo: "Updated Pseudo",
      };

      const res = await requestWithSupertest
        .patch(`/user/${userTwo.id}`)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(dataToUpdate);
      expect(res.status).toEqual(404);
      expect(res.body.message).toEqual("User not found");
    });

    test("should return 400 if no parameter is given", async () => {
      const dataToUpdate = {};

      const res = await requestWithSupertest
        .patch(`/user/${userOne.id}`)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(dataToUpdate);
      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual('"body" must have at least 1 key');
    });
  });

  // supprimer un utilisateur
  describe("DELETE /user/:id", () => {
    beforeEach(async () => {
      // ajout des utilisateurs
      await insertUsers([admin, userOne]);
    });

    test("should return 200 and the deleted user", async () => {
      const res = await requestWithSupertest
        .delete(`/user/${userOne.id}`)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        id: expect.anything(),
        role: "user",
        isDeleted: true,
        isEmailVerified: false,
        pseudo: userOne.pseudo,
        email: userOne.email,
        updatedAt: expect.anything(),
        createdAt: expect.anything(),
      });
    });

    test("should return 401 if user is not authenticated", async () => {
      const res = await requestWithSupertest.delete(`/user/${userOne.id}`);

      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual("Please authenticate");
    });

    test("should return 401 if user is not admin", async () => {
      const res = await requestWithSupertest
        .delete(`/user/${userOne.id}`)
        .set("Authorization", `Bearer ${userOneAccessToken}`);

      expect(res.status).toEqual(403);
      expect(res.body.message).toEqual("You have no access to this resource");
    });

    test("should return 404 if the user does not exist", async () => {
      const res = await requestWithSupertest
        .delete(`/user/${userTwo.id}`)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(res.status).toEqual(404);
      expect(res.body.message).toEqual("User not found");
    });

    test("should return 404 if the user is already deleted", async () => {
      await requestWithSupertest
        .delete(`/user/${userOne.id}`)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      const res = await requestWithSupertest
        .delete(`/user/${userOne.id}`)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(res.status).toEqual(404);
      expect(res.body.message).toEqual("User not found");
    });
  });
});
