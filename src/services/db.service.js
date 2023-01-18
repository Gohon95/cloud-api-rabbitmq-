const { Op } = require("sequelize");

const models = {};

const OPERATORS = [
  "$contains",
  "$and",
  "$or",
  "$like",
  "$in",
  "$eq",
  "$gt",
  "$lt",
  "$gte",
  "$lte",
  "$any",
  "$between",
];

/**
 * Crée un objet avec les données fournies en paramètre
 * @param {Model} model le modèle Sequelize sur lequel appeler la méthode
 * @param {object} data données de l'objet à créer
 * @returns l'objet créé
 */
const create = async (model, data) => {
  const result = await model.create(data);
  return result;
};

/**
 * Crée plusieurs objets avec les données fournies en paramètre
 * @param {Model} model le modèle Sequelize sur lequel appeler la méthode
 * @param {object} data liste de données des objets à créer
 * @param {object} options autres options à renseigner à Sequelize
 * @returns la liste des objets créés
 */
const createMany = async (model, data, options = { validate: true }) => {
  const results = await model.bulkCreate(data, options);
  return results;
};

/**
 * Récupère le premier objet qui correspond aux filtres
 * @param {Model} model le modèle Sequelize sur lequel appeler la méthode
 * @param {object} dataToFind filtres
 * @returns l'objet trouvé
 */
const findOne = async (model, query, options = {}) => {
  query = queryBuilderParser(query);
  if (options && options.select && options.select.length) {
    options.attributes = options.select;
    delete options.select;
  }
  if (options && options.include && options.include.length) {
    const include = [];
    options.include.forEach((i) => {
      i.model = models[i.model];
      if (i.query) {
        i.where = queryBuilderParser(i.query);
      }
      include.push(i);
    });
    options.include = include;
  }
  return await model.findOne({
    where: query,
    ...options,
  });
};

/**
 * Récupère un objet par sa clé primaire
 * @param {Model} model le modèle Sequelize sur lequel appeler la méthode
 * @param {any} pk clé primaire
 * @returns l'objet trouvé
 */
const findByPk = async (model, pk) => {
  return model.findByPk(pk);
};

const paginate = async (model, query, options = {}) => {
  query = queryBuilderParser(query);
  if (options && options.select && options.select.length) {
    options.attributes = options.select;
    delete options.select;
  }
  if (options && options.sort) {
    options.order = sortParser(options.sort);
    delete options.sort;
  }
  if (options && options.include && options.include.length) {
    const include = [];
    options.include.forEach((i) => {
      i.model = models[i.model];
      if (i.query) {
        i.where = queryBuilderParser(i.query);
      }
      include.push(i);
    });
    options.include = include;
  }
  options = {
    where: query,
    ...options,
  };
  const result = await model.paginate(options);
  const data = {
    data: result.docs,
    paginator: {
      itemCount: result.total,
      perPage: options.paginate || 25,
      pageCount: result.pages,
      currentPage: options.page || 1,
    },
  };
  return data;
};

/**
 * Récupère la liste de tous les objets qui correspondent aux filtres
 * @param {Model} model le modèle Sequelize sur lequel appeler la méthode
 * @param {object} dataToFind filtres
 * @returns la liste des objets trouvés
 */
const findAll = async (model, query, options) => {
  query = queryBuilderParser(query);
  if (options && options.select && options.select.length) {
    options.attributes = options.select;
    delete options.select;
  }
  if (options && options.sort) {
    options.order = sortParser(options.sort);
    delete options.sort;
  }
  if (options && options.include && options.include.length) {
    const include = [];
    options.include.forEach((i) => {
      i.model = models[i.model];
      if (i.query) {
        i.where = queryBuilderParser(i.query);
      }
      include.push(i);
    });
    options.include = include;
  }
  options = {
    where: query,
    ...options,
  };
  return model.findAll(options);
};

/**
 * Modifie les objets qui correspondent aux filtres
 * @param {Model} model le modèle Sequelize sur lequel appeler la méthode
 * @param {object} query filtres
 * @param {object} data données à modifier
 * @returns les objets modifiés
 */
const update = async (model, query, data) => {
  query = queryBuilderParser(query);
  let results = await model.update(data, { where: query });
  results = await model.findAll({ where: query });
  return results;
};

/**
 * Supprime plusieurs objets de la base de données s'ils correspondent aux filtres
 * @param {Model} model le modèle Sequelize sur lequel appeler la méthode
 * @param {object} query filtres
 * @returns les objets supprimés
 */
const destroy = async (model, query, options) => {
  query = queryBuilderParser(query);
  const findOptions = {};
  const destroyOptions = {};

  // gestion des tables avec option paranoid
  if (options && options.force) {
    findOptions.paranoid = false;
    destroyOptions.force = true;
    delete options.force;
  }

  // récupération des objets avant leur suppression
  const results = await model.findAll({ where: query, ...findOptions });
  await model.destroy({ where: query, ...destroyOptions });
  return results;
};

/**
 * Supprime un objet de la base de données d'après sa clé primaire
 * @param {Model} model le modèle Sequelize sur lequel appeler la méthode
 * @param {any} pk clé primaire
 * @returns
 */
const deleteByPk = async (model, pk, options = {}) => {
  await model.destroy({
    where: { [model.primaryKeyField]: pk },
    ...options,
  });
  const result = await findOne(
    model,
    { [model.primaryKeyField]: pk },
    { paranoid: false }
  );
  return result;
};

/**
 * Construit les filtres compatibles avec Sequelize
 * @param  {object} data : {}
 * @return {obj} data : query
 */
const queryBuilderParser = (data) => {
  if (data) {
    Object.entries(data).forEach(([key]) => {
      if (typeof data[key] === "object") {
        queryBuilderParser(data[key]);
      }
      if (OPERATORS.includes(key)) {
        const opKey = key.replace("$", "");
        data[Op[opKey]] = data[key];
        delete data[key];
      } else if (key === "$ne") {
        data[Op.not] = data[key];
        delete data[key];
      } else if (key === "$nin") {
        data[Op.notIn] = data[key];
        delete data[key];
      }
    });
  }

  return data;
};

/**
 * Contruit les paramètres de tri pour Sequelize
 * @param  {obj} input : {}
 * @return {obj} data : query
 */
const sortParser = (input) => {
  const newSortedObject = [];
  if (input) {
    Object.entries(input).forEach(([key, value]) => {
      if (value === 1) {
        newSortedObject.push([key, "ASC"]);
      } else if (value === -1) {
        newSortedObject.push([key, "DESC"]);
      }
    });
  }
  return newSortedObject;
};

const dbService = {
  create,
  createMany,
  paginate,
  findOne,
  findByPk,
  findAll,
  update,
  destroy,
  deleteByPk,
};

module.exports = dbService;
