const setupTestDB = require("../../utils/setupTestDB");
const { Utilisateur } = require("../../../src/models");
const materiel = require("../../../src/models/materiel.model");
const app = require("../../../src/app");
const httpStatus = require("http-status");
const request = require("supertest");
setupTestDB();

describe("Materiel routes", () => {
  describe("GET /v1/materiel/:id", () => {
    // Initiation de la création d'une materiel
    let recupererMateriel;

    beforeEach(async () => {
      recupererMateriel = {
        nom: "materiel 8",
        id_etat_materiel: "",
        id_entreprise: 1,
        id_conformite: 1,
        id_type_materiel: "",
        identifiant: "",
        date_validite: "",
      };
    });

    // test succès 200 => création d'une materiel
    test("devrait retourner 200 et récupérer avec succès un nouveau materiel si les données sont correctes.", async () => {
      const res = await request(app)
        .get("/v1/materiel/:id")
        .send(recupererMateriel);

      // vérifie si ça renvoie bien une 200
      expect(res.status).toEqual(200);

      // vérifie que la réponse du res.body.message correspond bien avec le materiel qui a été crée dans le recupererMateriel
      expect(res.body.message).toEqual({
        id: expect.anything(),
        nom: recupererMateriel.nom,
        id_etat_materiel: recupererMateriel.id_etat_materiel,
        id_entreprise: recupererMateriel.id_entreprise,
        id_conformite: recupererMateriel.id_conformite,
        id_type_materiel: recupererMateriel.id_type_materiel,
        identifiant: recupererMateriel.identifiant,
        date_validite: recupererMateriel.date_validite,
      });
    });

    // test erreur 400 => un champs est manquant
    test("devrait retourner 400 => element manquant / joi validation error", async () => {
      const res = await request(app).get("/v1/materiel/:id").send({
        nom: "materiel 8",
        id_entreprise: 1,
        id_conformite: 1,
        id_type_materiel: "",
        identifiant: "",
        date_validite: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });

    // test erreur 404 => url non trouvé
    test("devrait retourner 404 => url non trouvé", async () => {
      const res = await request(app).get("/v1/materielsss").send({
        nom: "materiel 8",
        id_etat_materiel: "",
        id_entreprise: 1,
        id_conformite: 1,
        id_type_materiel: "",
        identifiant: "",
        date_validite: "",
      });

      // vérifie si ça renvoie bien une erreur 404
      expect(res.status).toEqual(404);
    });

    // test erreur 400 => un champs est déjà existant
    test("devrait retourner 400 => element déjà existant", async () => {
      const res = await request(app).get("/v1/materiel/:id").send({
        nom: "materiel 1",
        id_etat_materiel: "",
        id_entreprise: 1,
        id_conformite: 1,
        id_type_materiel: "",
        identifiant: "",
        date_validite: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });
  });
});
