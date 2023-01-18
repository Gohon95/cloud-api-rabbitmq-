/*
 * File Created: 19/10/2022 15:22:16
 * Author: Quarante Soixante Nantes
 *
 * Modified By: Axel GONON
 * Last Modified: 18/01/2023 22:35:17
 */

const catchAsync = require("../utils/catchAsync");
const dbService = require("../services/db.service");
const amqp = require("amqplib/callback_api");

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
  flag: "commande en cours";

  let creationCommand = await dbService.create(Command, dataToCreate);

  res.send(creationCommand);

  // Step 1 : Create Connection
  amqp.connect("amqp://localhost", (connError, connection) => {
    if (connError) {
      throw connError;
    }
    // Step 2: Create Channel
    connection.createChannel((channelError, channel) => {
      if (channelError) {
        throw channelError;
      }
      // Step 3: Assert Queue
      const QUEUE = "statut";
      channel.assertQueue(QUEUE);
      // Step 4: Send message to queue
      channel.sendToQueue(QUEUE, Buffer.from("hello your status is available"));
      console.log(`Message send ${QUEUE}`);
    });
  });
});
function worker() {
  amqplib.connect(process.env.AMQP_URL, (err, conn) => {
    if (err) throw err;
    console.log("Connection rabbitmq");

    conn.createChannel((err, ch) => {
      if (err) throw err;
      console.log("Channel created");

      ch.assertQueue(queue, { durable: true });

      ch.consume(queue, (msg) => {
        if (msg !== null) {
          console.log("Message :", msg.content.toString());
          Commande.findByIdAndUpdate(
            msg.content.toString(),
            { flag: "commande terminée" },
            { upsert: true },
            () => {
              if (err) throw err;
              console.log("Commande updated");
              worker();
            }
          );
        }
      });
    });
  });
}

module.exports = {
  creerCommand,
};
