const setupTestDB = require("../../utils/setupTestDB");
const { Utilisateur } = require("../../../src/models");
const Vérification = require("../../../src/models/modele_verification.model");
const app = require("../../../src/app");
const httpStatus = require("http-status");
const request = require("supertest");
setupTestDB();

describe("Verification routes", () => {
  describe("PATCH /v1/verification/:id", () => {
    // Initiation de la création d'une verification
    let modifierVerification;

    beforeEach(async () => {
      modifierVerification = {
        nom: "Installation 11",
        description: "description",
        id_type_donnee: "",
        id_type_decenchement: "",
        id_critere: "",
        id_sousensemble: "",
        valeur1: "",
        valeur2: "",
        date_validite: "",
      };
    });

    // test succès 200 => modification d'une verification
    test("devrait retourner 200 et modifier avec succès une vérification si les données sont correctes.", async () => {
      const res = await request(app)
        .patch("/v1/verification/:id")
        .send(modifierVerification);

      // vérifie si ça renvoie bien une 200
      expect(res.status).toEqual(200);

      // vérifie que la réponse du res.body.message correspond bien avec la verification qui a été crée dans la modifierVerification
      expect(res.body.message).toEqual({
        id: expect.anything(),
        nom: modifierVerification.nom,
        description: modifierVerification.description,
        id_type_donnee: modifierVerification.id_type_donnee,
        id_type_decenchement: modifierVerification.id_type_decenchement,
        id_critere: modifierVerification.id_critere,
        id_sousensemble: modifierVerification.id_sousensemble,
        valeur1: modifierVerification.valeur1,
        valeur2: modifierVerification.valeur2,
        date_validite: modifierVerification.date_validite,
      });
    });

    // test erreur 400 => un champs est manquant
    test("devrait retourner 400 => element manquant / joi validation error", async () => {
      const res = await request(app).patch("/v1/verification/:id").send({
        nom: "Installation 11",
        id_type_donnee: "",
        id_type_decenchement: "",
        id_critere: "",
        id_sousensemble: "",
        valeur1: "",
        valeur2: "",
        date_validite: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });

    // test erreur 404 => url non trouvé
    test("devrait retourner 404 => url non trouvé", async () => {
      const res = await request(app).patch("/v1/verificationnnn").send({
        nom: "Installation 11",
        description: "description",
        id_type_donnee: "",
        id_type_decenchement: "",
        id_critere: "",
        id_sousensemble: "",
        valeur1: "",
        valeur2: "",
        date_validite: "",
      });

      // vérifie si ça renvoie bien une erreur 404
      expect(res.status).toEqual(404);
    });

    // test erreur 400 => un champs est déjà existant
    test("devrait retourner 400 => element déjà existant", async () => {
      const res = await request(app).patch("/v1/verification/:id").send({
        nom: "Installation 11",
        description: "description",
        id_type_donnee: "",
        id_type_decenchement: "",
        id_critere: "",
        id_sousensemble: "",
        valeur1: "",
        valeur2: "",
        date_validite: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });
  });
});
