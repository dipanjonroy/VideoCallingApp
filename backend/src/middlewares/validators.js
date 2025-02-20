const { userSchema } = require("../vailidation/userSchema");
const ExpressError = require("../utilities/ExpressError")

module.exports.userValidator = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    throw new ExpressError(401, error.details[0].message);
  } else {
    next();
  }
};
