const { response } = require("express");
const jwt = require("jsonwebtoken");
const {generateToken, renovarToken} = require("../helpers/jwt");

const validarJWT = (req, res = response, next) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    console.log('No hay token')
    return res.status(401).json({ message: "Token is required" });
  }
  let currentToken;
  try {
      currentToken=jwt.verify(token, process.env.JWT_SECRET);

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const decodedToken=jwt.decode(token);
      console.log("decoded token:",decodedToken)
      renovarToken(res,decodedToken);
      currentToken = decodedToken;
    }else{
      console.log('El token es invalido')
      return res.status(401).json({ message: "Invalid token" });
    }
  }
  console.log("currentToken",currentToken)
  if(currentToken.username===null || undefined){
    console.log("unsetted username")
    return res.status(401).json({ message: "Must registrate your username" });
  }
  req.uid = currentToken.uid;
  req.username = currentToken.username;
  next();
};

module.exports = { validarJWT };
