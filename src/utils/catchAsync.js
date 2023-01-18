/**
 * Encapsule un middleware pour récupérer les erreurs potentielles
 * @param {function} middleware le middleware à encapsuler
 * @returns un middleware qui sait gérer les erreurs
 */
const catchAsync = (middleware) => {
  return (req, res, next) => {
    Promise.resolve(middleware(req, res, next)).catch((err) => next(err));
  };
};

module.exports = catchAsync;
