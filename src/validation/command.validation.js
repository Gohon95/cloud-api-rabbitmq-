/*
 * File Created: 19/10/2022 15:22:16
 * Author: Quarante Soixante Nantes
 *
 * Modified By: Axel GONON
 * Last Modified: 18/01/2023 08:28:35
 */

const Joi = require("joi");

/**
 * Schemas Joi pour les requêtes liées aux commands
 * Ici on définit les champs, les types et les contraintes de la requête
 * On récupère les erreurs générées par Joi et on les formate ici
 */

/**
 * Schéma de la requête creerCommand
 */
const creerCommand = {
  body: Joi.object().keys({
    statut: Joi.string().required(),
  }),
};

/**
 * Schéma de la requête recupererCommand
 */
// const recupererCommand = {
//   params: Joi.object().keys({
//     id_command: Joi.string().required().custom(objectId),
//   }),
// };

/**
 * Schéma de la requête modifierCommand
 */
// const modifierCommand = {
//   params: Joi.object().keys({
//     id_command: Joi.string().required().custom(objectId),
//   }),
//   body: Joi.object()
//     .keys({
//       name: Joi.string(),
//       // role: Joi.required().valid("utilisateur", "admin"),
//     })
//     .min(1),
// };

module.exports = {
  creerCommand,
  // recupererCommand,
  // modifierCommand,
};
