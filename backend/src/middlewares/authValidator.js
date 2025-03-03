const jwt = require("jsonwebtoken");
const ExpressError = require("../utilities/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    throw new ExpressError(401, "Access expired! Please log in");
  }

  const decode = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);

  req.user = decode.userId;

  next();
};

module.exports.isLoggedOut = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (accessToken) {
    throw new ExpressError(401, "You are logged in. Please log out.");
  }

  next();
};
