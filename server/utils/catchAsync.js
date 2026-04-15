/**
 * Catch async errors and pass them to the global error middleware
 * so we don't have to write try-catch blocks in every controller.
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
