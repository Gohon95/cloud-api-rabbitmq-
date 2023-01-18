const setupTestDB = require("../../utils/setupTestDB");
const { Utilisateur } = require("../../../src/models");
const SousEnsemble = require("../../../src/models/sousensemble.model");
const app = require("../../../src/app");
const request = require("supertest");
setupTestDB();

describe("Sous Ensemble routes", () => {
  describe("PATCH /v1/sousensemble/:id", () => {
    // Initiation de la création d'un sous_ensemble
    let modifierSousEnsemble;

    beforeEach(async () => {
      modifierSousEnsemble = {
        nom: "Sous_ensemble 8",
        id_installation: "",
      };
    });

    // test succès 200 => modification d'un sous_ensemble
    test("devrait retourner 200 et créer avec succès unn nouveau sous_ensemble si les données sont correctes.", async () => {
      const res = await request(app)
        .patch("/v1/sousensemble/:id")
        .send(modifierSousEnsemble);

      // vérifie si ça renvoie bien une 200
      expect(res.status).toEqual(200);

      // vérifie que la réponse du res.body.message correspond bien avec le sous_ensemble qui a été crée dans le modifierSousEnsemble
      expect(res.body.message).toEqual({
        id: expect.anything(),
        nom: modifierSousEnsemble.nom,
        id_installation: modifierSousEnsemble.id_installation,
      });
    });

    // test erreur 400 => un champs est manquant
    test("devrait retourner 400 => element manquant / joi validation error", async () => {
      const res = await request(app).patch("/v1/sousensemble/:id").send({
        nom: "Installation 8",
        id_installation: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });

    // test erreur 404 => url non trouvé
    test("devrait retourner 404 => url non trouvé", async () => {
      const res = await request(app).patch("/v1/sousensembleee").send({
        nom: "Installation 8",
        id_installation: "",
      });

      // vérifie si ça renvoie bien une erreur 404
      expect(res.status).toEqual(404);
    });

    // test erreur 400 => un champs est déjà existant
    test("devrait retourner 400 => element déjà existant", async () => {
      const res = await request(app).patch("/v1/sousensemble/:id").send({
        nom: "Installation 8",
        id_installation: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });
  });
});
