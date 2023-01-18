/*
 * File Created: 19/10/2022 15:22:16
 * Author: Quarante Soixante Nantes
 *
 * Modified By: Axel GONON
 * Last Modified: 15/01/2023 11:14:28
 */

const { DataTypes } = require("sequelize");
const sequelizePaginate = require("sequelize-paginate");
const sequelize = require("../config/db.config");

/**
 * @description Modele de la table Command
 * @type {class} Command
 */
const Command = sequelize.define(
  "commands",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    statut: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
  },
  {
    // TODO : historisation à la place des timestamps ?
    timestamps: true,
    paranoid: true,
  }
);

// liaisons étrangères avec les tables correspondantes
// Conformite.hasMany(Command, {
//   foreignKey: "id_conformite",
// });

// Methode.hasMany(Command, {
//   foreignKey: "id_methode",
// });

// Entreprise.hasMany(Command, {
//   foreignKey: "id_entreprise",
// });

// mise en place de la pagination
sequelizePaginate.paginate(Command);

module.exports = Command;
