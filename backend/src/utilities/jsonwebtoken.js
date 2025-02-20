const jwt = require("jsonwebtoken");

const createSecretToken = (payload, secret_key, expiresIn) => {
  return jwt.sign(payload, secret_key, { expiresIn });
};

module.exports = createSecretToken;
