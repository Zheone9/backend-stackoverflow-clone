const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, res = response, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({ msg: "Token is required" });
  }

  try {
    const { uid, username } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    req.username = username;
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
  next();
};

module.exports = { validarJWT };
