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

module.exports = {
  generateToken,
};
