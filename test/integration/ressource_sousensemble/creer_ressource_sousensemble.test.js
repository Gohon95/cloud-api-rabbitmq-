const setupTestDB = require("../../utils/setupTestDB");
const { Utilisateur } = require("../../../src/models");
const RessourceSousensemble = require("../../../src/models/ressource_sousensemble.model");
const app = require("../../../src/app");
const request = require("supertest");
setupTestDB();

describe("Ressource SousEnsemble routes", () => {
  describe("POST /v1/ressource/", () => {
    // Initiation de la création d'une ressource de sous_ensemble
    let nouveauRessourceSousEnsemble;

    beforeEach(async () => {
      nouveauRessourceSousEnsemble = {
        id_installation: "",
        id_sousensemble: "",
      };
    });

    // test succès 200 => création d'une ressource d'un sous_ensemble
    test("devrait retourner 200 et créer avec succès une ressource d'un sous_ensemble si les données sont correctes.", async () => {
      const res = await request(app)
        .post("/v1/ressource")
        .send(nouveauRessourceSousEnsemble);

      // vérifie si ça renvoie bien une 200
      expect(res.status).toEqual(200);

      // vérifie que la réponse du res.body.message correspond bien avec la ressource d'un sous_ensemble qui a été crée dans le nouveauRessourceSousEnsemble
      expect(res.body.message).toEqual({
        id: expect.anything(),
        id_installation: nouveauRessourceSousEnsemble.id_installation,
        id_sousensemble: nouveauRessourceSousEnsemble.id_sousensemble,
      });
    });

    // test erreur 400 => un champs est manquant
    test("devrait retourner 400 => element manquant / joi validation error", async () => {
      const res = await request(app).post("/v1/ressource").send({
        id_installation: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });

    // test erreur 404 => url non trouvé
    test("devrait retourner 404 => url non trouvé", async () => {
      const res = await request(app).post("/v1/ressource").send({
        id_installation: "",
        id_sousensemble: "",
      });

      // vérifie si ça renvoie bien une erreur 404
      expect(res.status).toEqual(404);
    });

    // test erreur 400 => un champs est déjà existant
    test("devrait retourner 400 => element déjà existant", async () => {
      const res = await request(app).post("/v1/ressource").send({
        id_installation: "",
        id_sousensemble: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });
  });
});
