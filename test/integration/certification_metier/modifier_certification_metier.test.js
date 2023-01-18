const setupTestDB = require("../../utils/setupTestDB");
const { Utilisateur } = require("../../../src/models");
const CertificationMetier = require("../../../src/models/certification_metier.model");
const app = require("../../../src/app");
const request = require("supertest");
setupTestDB();

describe("Certification Metier routes", () => {
  describe("PATCH /v1/certification_metier/:id", () => {
    // Initiation de la création d'une certification métier
    let modifierCertificationMetier;

    beforeEach(async () => {
      modifierCertificationMetier = {
        id_utilisateur: "",
        id_statut: "",
        id_methode: "",
        id_niveau: "",
        date_validite: "",
      };
    });

    // test succès 200 => modification d'une certification métier
    test("devrait retourner 200 et modifier avec succès une certification métier si les données sont correctes.", async () => {
      const res = await request(app)
        .patch("/v1/certification_metier/:id")
        .send(modifierCertificationMetier);

      // vérifie si ça renvoie bien une 200
      expect(res.status).toEqual(200);

      // vérifie que la réponse du res.body.message correspond bien avec la certification métier qui a été crée dans le modifierCertificationMetier
      expect(res.body.message).toEqual({
        id: expect.anything(),
        id_utilisateur: modifierCertificationMetier.id_utilisateur,
        id_statut: modifierCertificationMetier.id_utilisateur,
        id_methode: modifierCertificationMetier.id_methode,
        id_niveau: modifierCertificationMetier.id_niveau,
        date_validite: modifierCertificationMetier.date_validite,
      });
    });

    // test erreur 400 => un champs est manquant
    test("devrait retourner 400 => element manquant / joi validation error", async () => {
      const res = await request(app)
        .patch("/v1/certification_metier/:id")
        .send({
          id_utilisateur: "",
          id_methode: "",
          id_niveau: "",
          date_validite: "",
        });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });

    // test erreur 404 => url non trouvé
    test("devrait retourner 404 => url non trouvé", async () => {
      const res = await request(app).patch("/v1/certification_metierrr").send({
        id_utilisateur: "",
        id_statut: "",
        id_methode: "",
        id_niveau: "",
        date_validite: "",
      });

      // vérifie si ça renvoie bien une erreur 404
      expect(res.status).toEqual(404);
    });

    // test erreur 400 => un champs est déjà existant
    test("devrait retourner 400 => element déjà existant", async () => {
      const res = await request(app)
        .patch("/v1/certification_metier/:id")
        .send({
          id_utilisateur: "",
          id_statut: "",
          id_methode: "",
          id_niveau: "",
          date_validite: "",
        });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });
  });
});
