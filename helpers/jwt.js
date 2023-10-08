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

const verifyAndDecodeToken = async (token, refreshToken) => {
  let newToken, decoded;
  if (!token) {
    try {
      const result = await renovarToken(refreshToken);
      newToken = result.token;
    } catch (error) {
      throw new Error("Could not refresh the token");
    }
    decoded = jwt.decode(newToken);
    console.log("decoded", decoded);
  } else {
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        try {
          const result = await renovarToken(refreshToken);
          newToken = result.token;
        } catch (error) {
          throw new Error("Could not refresh the expired token");
        }
        decoded = jwt.decode(newToken);
      } else {
        throw err; // re-lanza el error
      }
    }
  }
  return decoded;
};
module.exports = {
  generateToken,
  generateRefreshToken,
  renovarToken,
  renovarTokenWithUnsettedUsername,
  verifyAndDecodeToken,
};
