const fs = require("fs");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const postmanToOpenApi = require("postman-to-openapi");

/**
 * Génère le swagger à la volée à partir d'un fichier postman
 * @param {string} postmanFile chemin du fichier postman
 * @param {string} swaggerFile chemin du fichier swagger
 * @returns un middleware qui génère le swagger
 */
const generateDocs = (postmanFile, swaggerFile) => {
  return async (req, res, next) => {
    let postman;
    let swagger;
    let swaggerExists = true;
    let swaggerExpired = false;

    // récupération du fichier postman
    try {
      postman = fs.statSync(postmanFile);
    } catch (err) {
      return next(err);
    }

    // récupération du fichier swagger si il existe
    try {
      swagger = fs.statSync(swaggerFile);
    } catch (err) {
      swaggerExists = false;
    }

    // comparaison des dates de modifications des deux fichiers
    if (swaggerExists) {
      // si la date du swagger est antérieure à celle du postman, alors le swagger n'est plus valide
      swaggerExpired = swagger.mtime.getTime() < postman.mtime.getTime();
    }

    // si le swagger n'existe pas ou qu'il n'est plus valide, alors il est regénéré
    if (!swaggerExists || swaggerExpired) {
      console.log("generating swagger...");
      postmanToOpenApi(postmanFile, swaggerFile)
        .then(() => next())
        .catch((err) => next(err));
    } else {
      next();
    }
  };
};

/**
 * Charge le fichier swagger et génère l'ui de la page de documentation
 * @param {string} swaggerFile chemin du fichier swagger
 * @returns un middleware qui fournit le html de swagger-ui
 */
const setupSwagger = (swaggerFile) => {
  try {
    const swagger = YAML.load(swaggerFile);
    swagger.servers[0].url = "/";
    return swaggerUi.setup(swagger);
  } catch (err) {
    return swaggerUi.setup(null);
  }
};

module.exports = { generateDocs, setupSwagger };
