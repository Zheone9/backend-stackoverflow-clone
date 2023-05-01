const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, res = response, next) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    console.log('No hay token')
    return res.status(401).json({ msg: "Token is required" });
  }

  try {
    const { uid, username } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    req.username = username;
  } catch (error) {
    console.log('El token es invalido')
    return res.status(401).json({ msg: "Invalid token" });
  }
  next();
};

module.exports = { validarJWT };
