// Importar repositorio y librerías necesarias
const userRepository = require("../repositories/userRepository");
const { generateToken, generateRefreshToken } = require("../helpers/jwt");
const { verifyGoogleIdToken } = require("../helpers/google/validateTokenId");
const bcrypt = require("bcryptjs");
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} = require("../helpers/cookiesSetup");

const loginUser = async ({ username, password }) => {
  const user = await userRepository.findByUsername(username);

  if (!user) {
    return {
      status: 400,
      response: { ok: false, message: "Usuario no encontrado" },
    };
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return {
      status: 400,
      response: { ok: false, message: "Contraseña incorrecta" },
    };
  }

  const token = await generateToken(user._id, user.username);
  const refreshToken = await generateRefreshToken(user._id, user.username);

  const friendList = await userRepository.findFriendList(user._id);

  return {
    status: 200,
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
    response: {
      ok: true,
      payload: {
        username: user.username,
        uid: user._id,
        reputation: user.reputation,
        picture: user.picture,
        friendList,
      },
      token,
      refreshToken,
    },
  };
};

const renewToken = async (uid, username) => {
  return await generateToken(uid, username);
};

const loginWithGoogle = async ({ id_token, clientId }) => {
  const googleUser = await verifyGoogleIdToken(id_token, clientId);
  if (!googleUser) {
    return {
      status: 400,
      response: { ok: false, message: "Token de Google inválido" },
    };
  }

  let user = await userRepository.findByEmail(googleUser.email);
  let token;
  let refreshToken;

  if (!user) {
    const userData = {
      email: googleUser.email,
      usernameIsSet: false,
      isGoogleUser: true,
    };
    user = await userRepository.create(userData);
    token = await generateToken(user.id, null);
    refreshToken = await generateRefreshToken(user.id, null);
  } else {
    token = await generateToken(user.id, user.username);
    refreshToken = await generateRefreshToken(user.id, user.username);
  }

  const friendList = await userRepository.findFriendList(user._id);

  return {
    status: 200,
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
    token,
    refreshToken,
    response: {
      ok: true,
      payload: {
        uid: user._id,
        reputation: user.reputation,
        username: user.username,
        picture: user.picture,
        friendList,
      },
      token,
    },
  };
};

module.exports = {
  loginUser,
  renewToken,
  loginWithGoogle,
};
