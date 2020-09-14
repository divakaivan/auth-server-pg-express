const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) return res.status(403).json("Not authorised");

    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);

    req.user = payload.user;
    // payload.user comes from jwtGenerator where we set the use in the payload
  } catch (error) {
    console.error(error.message);
    return res.status(403).json("Not authorised");
  }
};
