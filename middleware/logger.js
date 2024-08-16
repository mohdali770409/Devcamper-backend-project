const logger = (req, res, next) => {
  req.name = "Mohd Ali";
  console.log("middleware hitted");
  next();
};

module.exports = logger;
