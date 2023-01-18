const setupTestDB = require("../../utils/setupTestDB");
const { Utilisateur } = require("../../../src/models");
const Installation = require("../../../src/models/installation.model");
const app = require("../../../src/app");
const httpStatus = require("http-status");
const request = require("supertest");
setupTestDB();

describe("Installation routes", () => {
  describe("DELETE /v1/installation", () => {
    // Initiation de la création d'une installation
    let supprimerInstallation;

    beforeEach(async () => {
      supprimerInstallation = {
        nom: "Installation 11",
        id_conformite: 2,
        id_methode: 2,
        id_entreprise: 1,
        isMobile: true,
      };
    });

    // test succès 200 => suppression d'une installation
    test("devrait retourner 200 et supprimer avec succès une installation si les données sont correctes.", async () => {
      const res = await request(app)
        .delete("/v1/installation")
        .send(supprimerInstallation);

      // vérifie si ça renvoie bien une 200
      expect(res.status).toEqual(200);

      // vérifie que la réponse du res.body.message correspond bien avec l'installation qui a été crée dans le supprimerInstallation
      expect(res.body.message).toEqual({
        id: expect.anything(),
        nom: supprimerInstallation.nom,
        id_conformite: supprimerInstallation.id_conformite,
        id_methode: supprimerInstallation.id_methode,
        id_entreprise: supprimerInstallation.id_entreprise,
        isMobile: supprimerInstallation.isMobile,
      });
    });

    // test erreur 400 => un champs est manquant
    test("devrait retourner 400 => element manquant / joi validation error", async () => {
      const res = await request(app).delete("/v1/installation").send({
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
      const res = await request(app).delete("/v1/installationsss").send({
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
      const res = await request(app).delete("/v1/installation").send({
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
