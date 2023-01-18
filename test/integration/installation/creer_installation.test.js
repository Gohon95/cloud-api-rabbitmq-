const setupTestDB = require("../../utils/setupTestDB");
const { Utilisateur } = require("../../../src/models");
const Installation = require("../../../src/models/ver");
const app = require("../../../src/app");
const httpStatus = require("http-status");
const request = require("supertest");
setupTestDB();

describe("Installation routes", () => {
  describe("POST /v1/installation", () => {
    // Initiation de la création d'une installation
    let nouvelleInstallation;

    beforeEach(async () => {
      nouvelleInstallation = {
        nom: "Installation 11",
        id_conformite: 2,
        id_methode: 2,
        id_entreprise: 1,
        isMobile: true,
      };
    });

    // test succès 200 => création d'une installation
    test("devrait retourner 200 et créer avec succès une nouvelle installation si les données sont correctes.", async () => {
      const res = await request(app)
        .post("/v1/installation")
        .send(nouvelleInstallation);

      // vérifie si ça renvoie bien une 200
      expect(res.status).toEqual(200);

      // vérifie que la réponse du res.body.message correspond bien avec l'installation qui a été crée dans le nouvelleInstallation
      expect(res.body.message).toEqual({
        id: expect.anything(),
        nom: nouvelleInstallation.nom,
        id_conformite: nouvelleInstallation.id_conformite,
        id_methode: nouvelleInstallation.id_methode,
        id_entreprise: nouvelleInstallation.id_entreprise,
        isMobile: nouvelleInstallation.isMobile,
      });
    });

    // test erreur 400 => un champs est manquant
    test("devrait retourner 400 => element manquant / joi validation error", async () => {
      const res = await request(app).post("/v1/installation").send({
        nom: "Installation 11",
        id_methode: 2,
        id_entreprise: 1,
        isMobile: true,
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });

    // test erreur 404 => url non trouvé
    test("devrait retourner 404 => url non trouvé", async () => {
      const res = await request(app).post("/v1/installationsss").send({
        nom: "Installation 11",
        id_methode: 2,
        id_entreprise: 1,
        isMobile: true,
      });

      // vérifie si ça renvoie bien une erreur 404
      expect(res.status).toEqual(404);
    });

    // test erreur 400 => un champs est déjà existant
    test("devrait retourner 400 => element déjà existant", async () => {
      const res = await request(app).post("/v1/installation").send({
        nom: "Installation 11",
        id_conformite: 1,
        id_methode: 2,
        id_entreprise: 1,
        isMobile: true,
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });
  });
});
