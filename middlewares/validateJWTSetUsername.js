const { response } = require("express");
const jwt = require("jsonwebtoken");
const { renovarTokenWithUnsettedUsername } = require("../helpers/jwt");

const validarJWTSetUsername = async (req, res = response, next) => {
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
      const { token, refreshToken } = await renovarTokenWithUnsettedUsername(
        refreshTokenCookie
      );
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
          const {
            token,
            refreshToken,
          } = await renovarTokenWithUnsettedUsername(refreshTokenCookie);
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
  req.uid = currentToken.uid;
  next();
};
module.exports = { validarJWTSetUsername };
