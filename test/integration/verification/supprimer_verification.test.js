const setupTestDB = require("../../utils/setupTestDB");
const { Utilisateur } = require("../../../src/models");
const Vérification = require("../../../src/models/modele_verification.model");
const app = require("../../../src/app");
const httpStatus = require("http-status");
const request = require("supertest");
setupTestDB();

describe("Verification routes", () => {
  describe("DELETE /v1/verification/:id", () => {
    // Initiation de la création d'une verification
    let supprimerverification;

    beforeEach(async () => {
      supprimerverification = {
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

    // test succès 200 => suppression d'une verification
    test("devrait retourner 200 et supprimer avec succès une vérification si les données sont correctes.", async () => {
      const res = await request(app)
        .delete("/v1/verification/:id")
        .send(supprimerverification);

      // vérifie si ça renvoie bien une 200
      expect(res.status).toEqual(200);

      // vérifie que la réponse du res.body.message correspond bien avec la verification qui a été crée dans supprimerVerification
      expect(res.body.message).toEqual({
        id: expect.anything(),
        nom: supprimerverification.nom,
        description: supprimerverification.description,
        id_type_donnee: supprimerverification.id_type_donnee,
        id_type_decenchement: supprimerverification.id_type_decenchement,
        id_critere: supprimerverification.id_critere,
        id_sousensemble: supprimerverification.id_sousensemble,
        valeur1: supprimerverification.valeur1,
        valeur2: supprimerverification.valeur2,
        date_validite: supprimerverification.date_validite,
      });
    });

    // test erreur 400 => un champs est manquant
    test("devrait retourner 400 => element manquant / joi validation error", async () => {
      const res = await request(app).delete("/v1/verification/:id").send({
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
      const res = await request(app).delete("/v1/verificationnnn").send({
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
      const res = await request(app).delete("/v1/verification/:id").send({
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
