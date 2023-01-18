/**
 * Crée un objet qui est un sous ensemble de l'objet passé en paramètre
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
  return keys.reduce(function (obj, key) {
    if (key in object) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = pick;
