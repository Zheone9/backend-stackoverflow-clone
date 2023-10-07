const { response } = require("express");
const jwt = require("jsonwebtoken");
const { renovarToken } = require("../helpers/jwt");

const validarJWT = async (req, res = response, next) => {
  const refreshTokenCookie = req.cookies.refreshToken;
  if (!refreshTokenCookie) {
    console.log("No refresh token provided");
    return res.status(403).json({ message: "Refresh token is required" });
  }
  const tokenCookie = req.cookies.jwtToken;

  let currentToken;
  let currentRefreshToken;

  if (!tokenCookie) {
    try {
      const { token, refreshToken } = await renovarToken(refreshTokenCookie);
      currentToken = jwt.decode(token);
      currentRefreshToken = jwt.decode(refreshToken);
      res.cookie("jwtToken", token, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: error });
    }
  } else {
    try {
      currentToken = jwt.verify(tokenCookie, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        try {
          const { token, refreshToken } = await renovarToken(
            refreshTokenCookie
          );
          currentToken = jwt.decode(token);
          currentRefreshToken = jwt.decode(refreshToken);
          res.cookie("jwtToken", token, { httpOnly: true });
          res.cookie("refreshToken", refreshToken, { httpOnly: true });
        } catch (error) {
          console.log(error);
          return res.status(401).json({ message: "Could not refresh token" });
        }
      } else {
        console.log(error.name);
        console.log("El token es invalido");
        return res.status(401).json({ message: "Invalid token" });
      }
    }
  }

  if (currentToken.username === null || currentToken.username === undefined) {
    console.log("unsetted username");
    return res.status(401).json({ message: "Must registrate your username" });
  }

  req.uid = currentToken.uid;
  req.username = currentToken.username;

  next();
};
module.exports = { validarJWT };
