const jwt = require("jsonwebtoken");

const generateToken = (uid, username) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, username };
    const options = {
      expiresIn: "1h",
    };
    jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
      if (err) reject("No se pudo generar el token");
      resolve(token);
    });
  });
};

const renovarToken = (res, decodedToken) => {
  const newToken = generateToken(decodedToken.uid, decodedToken.username);
  const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true,
  };
  res.cookie("jwtToken", newToken, cookieOptions);
}

module.exports = {
  generateToken,renovarToken
};
