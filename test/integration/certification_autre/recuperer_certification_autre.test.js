const setupTestDB = require("../../utils/setupTestDB");
const { Utilisateur } = require("../../../src/models");
const CertificationMetier = require("../../../src/models/certification_autre.model");
const app = require("../../../src/app");
const request = require("supertest");
setupTestDB();

describe("Certification Autre routes", () => {
  describe("GET /v1/certification_autre/:id", () => {
    // Initiation de la création d'une certification autre
    let recupererCertificationAutre;

    beforeEach(async () => {
      recupererCertificationAutre = {
        nom: "certification 1",
        description: "description",
        id_utilisateur: "",
        id_statut: "",
        date_validite: "",
      };
    });

    // test succès 200 => récupération d'une certification autre
    test("devrait retourner 200 et récupérer avec succès une certification autre si les données sont correctes.", async () => {
      const res = await request(app)
        .get("/v1/certification_autre/:id")
        .send(recupererCertificationAutre);

      // vérifie si ça renvoie bien une 200
      expect(res.status).toEqual(200);

      // vérifie que la réponse du res.body.message correspond bien avec la certification autre qui a été crée dans le recupererCertificationAutre
      expect(res.body.message).toEqual({
        id: expect.anything(),
        nom: recupererCertificationAutre.nom,
        description: recupererCertificationAutre.description,
        id_utilisateur: recupererCertificationAutre.id_utilisateur,
        id_statut: recupererCertificationAutre.id_utilisateur,
        date_validite: recupererCertificationAutre.date_validite,
      });
    });

    // test erreur 400 => un champs est manquant
    test("devrait retourner 400 => element manquant / joi validation error", async () => {
      const res = await request(app).get("/v1/certification_autre/:id").send({
        nom: "certification 1",
        id_utilisateur: "",
        id_statut: "",
        date_validite: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });

    // test erreur 404 => url non trouvé
    test("devrait retourner 404 => url non trouvé", async () => {
      const res = await request(app).get("/v1/certification_autrerr").send({
        nom: "certification 1",
        description: "description",
        id_utilisateur: "",
        id_statut: "",
        date_validite: "",
      });

      // vérifie si ça renvoie bien une erreur 404
      expect(res.status).toEqual(404);
    });

    // test erreur 400 => un champs est déjà existant
    test("devrait retourner 400 => element déjà existant", async () => {
      const res = await request(app).get("/v1/certification_autre/:id").send({
        nom: "certification 1",
        description: "description",
        id_utilisateur: "",
        id_statut: "",
        date_validite: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });
  });
});
