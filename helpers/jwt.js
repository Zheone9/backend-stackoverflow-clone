const jwt = require("jsonwebtoken");

const generateToken = (uid, username) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, username };
    const options = {
      expiresIn: "20s",
    };
    jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
      if (err) reject("No se pudo generar el token");
      resolve(token);
    });
  });
};

const generateRefreshToken = (uid, username) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, username };
    const options = {
      expiresIn: "7d",
    };
    jwt.sign(payload, process.env.JWT_SECRET_REFRESH, options, (err, token) => {
      if (err) reject("No se pudo generar el token");
      resolve(token);
    });
  });
};

const renovarToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH,
      async (err, user) => {
        if (err) {
          reject("Invalid refresh token");
        } else {
          try {
            const token = await generateToken(user.uid, user.username);
            const refreshToken = await generateRefreshToken(
              user.uid,
              user.username
            );
            resolve({ token, refreshToken });
          } catch (error) {
            reject("Could not generate tokens");
          }
        }
      }
    );
  });
};

const renovarTokenWithUnsettedUsername = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH,
      async (err, user) => {
        if (err) {
          reject("Invalid refresh token");
        } else {
          try {
            const token = await generateToken(user.uid, null);
            const refreshToken = await generateRefreshToken(user.uid, null);
            resolve({ token, refreshToken });
          } catch (error) {
            reject("Could not generate tokens");
          }
        }
      }
    );
  });
};

module.exports = {
  generateToken,
  generateRefreshToken,
  renovarToken,
  renovarTokenWithUnsettedUsername,
};
