/*
 * File Created: 19/10/2022 15:22:16
 * Author: Quarante Soixante Nantes
 *
 * Modified By: Axel GONON
 * Last Modified: 16/01/2023 13:41:01
 */

const express = require("express");
const validate = require("../../src/middlewares/validate.middleware");
const commandValidation = require("../validation/command.validation");
const commandController = require("../controllers/command.controller");

const router = express.Router();

router.post(
  "/",
  validate(commandValidation.creerCommand),
  commandController.creerCommand
);
// router.get(
//   "/",
//   auth(),
//   validate(commandValidation.recupererCommands),
//   commandController.recupererCommands
// );
// router.patch(
//   "/",
//   auth(),
//   validate(commandValidation.modifierCommand),
//   commandController.modifierCommand
// );
// router.delete(
//   "/",
//   auth(),
//   validate(commandValidation.supprimerCommands),
//   commandController.supprimercommand
// );

module.exports = router;
