const setupTestDB = require("../../utils/setupTestDB");
const { Utilisateur } = require("../../../src/models");
const Instruction = require("../../../src/models/instruction.model");
const app = require("../../../src/app");
const httpStatus = require("http-status");
const request = require("supertest");
setupTestDB();

describe("Instruction routes", () => {
  describe("DELETE /v1/instruction/:id", () => {
    // Initiation de la création d'une instruction
    let supprimerInstruction;

    beforeEach(async () => {
      supprimerInstruction = {
        id_type_document: "",
        id_methode: 2,
        titre: "",
        note: "",
        url: "",
      };
    });

    // test succès 200 => suppression d'une instruction
    test("devrait retourner 200 et supprimer avec succès une instruction si les données sont correctes.", async () => {
      const res = await request(app)
        .delete("/v1/instruction/:id")
        .send(supprimerInstruction);

      // vérifie si ça renvoie bien une 200
      expect(res.status).toEqual(200);

      // vérifie que la réponse du res.body.message correspond bien avec l'instruction qui a été crée dans le supprimerInstruction
      expect(res.body.message).toEqual({
        id: expect.anything(),
        id_type_document: supprimerInstruction.id_type_document,
        id_methode: supprimerInstruction.id_methode,
        titre: supprimerInstruction.titre,
        note: supprimerInstruction.note,
        url: supprimerInstruction.url,
      });
    });

    // test erreur 400 => un champs est manquant
    test("devrait retourner 400 => element manquant / joi validation error", async () => {
      const res = await request(app).delete("/v1/instruction/:id").send({
        id_type_document: "",
        titre: "",
        note: "",
        url: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });

    // test erreur 404 => url non trouvé
    test("devrait retourner 404 => url non trouvé", async () => {
      const res = await request(app).delete("/v1/instructionnn").send({
        id_type_document: "",
        id_methode: 2,
        titre: "",
        note: "",
        url: "",
      });

      // vérifie si ça renvoie bien une erreur 404
      expect(res.status).toEqual(404);
    });

    // test erreur 400 => un champs est déjà existant
    test("devrait retourner 400 => element déjà existant", async () => {
      const res = await request(app).delete("/v1/instruction/:id").send({
        id_type_document: "",
        id_methode: 2,
        titre: "",
        note: "",
        url: "",
      });

      // vérifie si ça renvoie bien une erreur 400
      expect(res.status).toEqual(400);
    });
  });
});
