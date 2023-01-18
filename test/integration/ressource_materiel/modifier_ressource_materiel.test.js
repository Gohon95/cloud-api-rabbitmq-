const setupTestDB = require("../../utils/setupTestDB");
const { Utilisateur } = require("../../../src/models");
const RessourceMateriel = require("../../../src/models/ressource_materiel.model");
const app = require("../../../src/app");
const request = require("supertest");
setupTestDB();

describe("Ressource Materiel routes", () => {
  describe("PATCH /v1/materiel/ressource/:id", () => {
    // Initiation de la création d'une ressource d'un matériel
    let modifierRessourceMateriel;

    beforeEach(async () => {
      modifierRessourceMateriel = {
        id_ressource: "",
        id_materiel: "",
      };
    });

    // test succès 200 => modification d'une ressource d'un matériel
    test("devrait retourner 200 et modifier avec succès une ressource_materiel si les données sont correctes.", async () => {
      const res = await request(app)
        .patch("/v1/materiel/resssource/:id")
        .send(modifierRessourceMateriel);

      // vérifie si ça renvoie bien une 200
      expect(res.status).toEqual(200);

      // vérifie que la réponse du res.body.message correspond bien avec la ressource d'un materiel qui a été crée dans la modifierRessourceMateriel
      expect(res.body.message).toEqual({
        id: expect.anything(),
        id_ressource: modifierRessourceMateriel.id_ressource,
        id_materiel: modifierRessourceMateriel.id_materiel,
      });
    });

    // test erreur 400 => un champs est manquant
    test("devrait retourner 400 => element manquant / joi validation error", async () => {
      const res = await request(app).patch("/v1/materiel/resssource/:id").send({
        id_ressource: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });

    // test erreur 404 => url non trouvé
    test("devrait retourner 404 => url non trouvé", async () => {
      const res = await request(app).patch("/v1/materiel/resssourceee").send({
        id_ressource: "",
        id_materiel: "",
      });

      // vérifie si ça renvoie bien une erreur 404
      expect(res.status).toEqual(404);
    });

    // test erreur 400 => un champs est déjà existant
    test("devrait retourner 400 => element déjà existant", async () => {
      const res = await request(app).patch("/v1/materiel/resssource/:id").send({
        id_ressource: "",
        id_materiel: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });
  });
});
