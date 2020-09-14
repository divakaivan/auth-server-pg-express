const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id) {
  const paylod = {
    user: user_id,
  };

  return jwt.sign(paylod, process.env.JWT_SECRET, { expiresIn: "1hr" });
}

module.exports = jwtGenerator;
