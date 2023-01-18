/*
 * File Created: 19/10/2022 15:22:16
 * Author: Quarante Soixante Nantes
 *
 * Modified By: Axel GONON
 * Last Modified: 18/01/2023 08:33:17
 */

const catchAsync = require("../utils/catchAsync");
const dbService = require("../services/db.service");

// import des classes models
const Command = require("../models/command.model");

/**
 * @description : crée un objet Command dans la base de données
 * @param {Object} req : requête qui contient le body pour la création de l'objet
 * @param {Object} res : réponse qui contient l'objet créé
 * @return {Command} : Command créé {idMessage, message, data}
 */
const creerCommand = catchAsync(async (req, res) => {
  let dataToCreate = req.body;

  let creationCommand = await dbService.create(Command, dataToCreate);

  res.send(creationCommand);
});

module.exports = {
  creerCommand,
};
