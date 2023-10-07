const userRepository = require("../repositories/userRepository");
const { generateToken, generateRefreshToken } = require("../helpers/jwt");
const bcrypt = require("bcryptjs");
const io = require("../io");
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} = require("../helpers/cookiesSetup");

const getUserInfo = async (username) => {
  return await userRepository.findByUsername(username);
};
const getFriendList = async (uid) => {
  return await userRepository.findFriendList(uid);
};

const updateOpenedFriendRequests = async (uid) => {
  const user = await userRepository.findById(uid);
  if (!user) {
    return { success: false, message: "El usuario no existe." };
  }
  if (user.openedFriendRequests) {
    return {
      success: false,
      message:
        "Ya has actualizado las notificaciones de solicitudes de amistad.",
    };
  }
  await userRepository.updateOpenedFriendRequests(uid);
  return { success: true, message: "Se ha actualizado correctamente" };
};

const cancelFriendRequest = async (uid, friendUsername) => {
  const user = await userRepository.findById(uid);
  if (!user) {
    return { success: false, message: "El usuario no existe." };
  }
  const friend = await userRepository.findByUsername(friendUsername);
  if (!friend) {
    return { success: false, message: "El usuario no existe." };
  }
  if (!user.friendRequestsSent.includes(friend._id)) {
    return {
      success: false,
      message: "No has enviado ninguna solicitud de amistad a este usuario.",
    };
  }

  await userRepository.cancelFriendRequest(uid, friend._id);
  return { success: true, message: "Solicitud de amistad cancelada." };
};

const checkFriendRequest = async (uid, friendUsername) => {
  const user = await userRepository.findById(uid);
  if (!user) {
    return { success: false, message: "El usuario no existe." };
  }
  const friend = await userRepository.findByUsername(friendUsername);
  if (!friend) {
    return { success: false, message: "El usuario no existe." };
  }

  return {
    success: true,
    friendRequestSent: user.friendRequestsSent.includes(friend._id),
  };
};

const getIsFriend = async (uid, friendUsername) => {
  const user = await userRepository.findById(uid);
  if (!user) {
    return { success: false, message: "El usuario no existe." };
  }
  const friend = await userRepository.findByUsername(friendUsername);
  if (!friend) {
    return { success: false, message: "El usuario no existe." };
  }
  return { success: true, isFriend: user.friends.includes(friend._id) };
};

const getFriendRequests = async (uid) => {
  const friendRequests = await userRepository.findFriendRequests(uid);
  return friendRequests;
};

const removeFriend = async (uid, friendUsername) => {
  const user = await userRepository.findById(uid);
  if (!user) {
    return { success: false, message: "El usuario no existe." };
  }
  const friend = await userRepository.findByUsername(friendUsername);
  if (!friend) {
    return { success: false, message: "El usuario no existe." };
  }

  if (!user.friends.includes(friend._id)) {
    return { success: false, message: "No eres amigo de este usuario." };
  }

  await userRepository.removeFriend(uid, friend._id);
  return { success: true, message: "Amigo eliminado." };
};

const declineFriendRequest = async (uid, friendUsername) => {
  const user = await userRepository.findById(uid);
  if (!user) {
    return { success: false, message: "El usuario no existe." };
  }
  const friend = await userRepository.findByUsername(friendUsername);
  if (!friend) {
    return { success: false, message: "El usuario no existe." };
  }
  if (!user.friendRequestsReceived.includes(friend._id)) {
    return {
      success: false,
      message: "No tienes ninguna solicitud de amistad de este usuario.",
    };
  }

  await userRepository.declineFriendRequest(uid, friend._id);

  return { success: true, message: "Solicitud de amistad aceptada." };
};

const acceptFriendRequest = async (uid, friendUsername) => {
  const user = await userRepository.findById(uid);
  if (!user) {
    return { success: false, message: "El usuario no existe." };
  }
  const friend = await userRepository.findByUsername(friendUsername);
  if (!friend) {
    return { success: false, message: "El usuario no existe." };
  }
  if (!user.friendRequestsReceived.includes(friend._id)) {
    return {
      success: false,
      message: "No tienes ninguna solicitud de amistad de este usuario.",
    };
  }

  await userRepository.acceptFriendRequest(uid, friend._id);

  return { success: true, message: "Solicitud de amistad aceptada." };
};

const changeUsername = async (uid, oldUsername, newUsername) => {
  const user = await userRepository.findByUsername(newUsername);

  if (user) {
    return { success: false, message: "El nombre de usuario ya existe." };
  }

  await userRepository.updateUsername(uid, oldUsername, newUsername);
  const token = await generateToken(uid, newUsername);
  const refreshToken = await generateRefreshToken(uid, newUsername);

  return {
    success: true,
    token,
    refreshToken,
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
  };
};
const sentFriendRequest = async (uid, friendUsername) => {
  const user = await userRepository.findById(uid);
  if (!user) {
    return { success: false, message: "El usuario no existe." };
  }
  const friend = await userRepository.findByUsername(friendUsername);
  if (!friend) {
    return { success: false, message: "El usuario no existe." };
  }

  if (user.friendRequestsSent.includes(friend._id)) {
    return {
      success: false,
      message: "Ya has enviado una solicitud de amistad a este usuario.",
    };
  }
  if (user._id.equals(friend._id)) {
    return {
      success: false,
      message: "No puedes enviarte una solicitud de amistad a ti mismo.",
    };
  }
  await userRepository.sentFriendRequest(uid, friend._id);

  const friendId = friend._id.toString(); // Convierte el ObjectId a una cadena
  io.getIO().to(friendId).emit("solicitudAmistad", {
    uid,
    username: user.username,
    picture: user.picture,
  });

  return { success: true, message: "Solicitud de amistad enviada." };
};

const setUsername = async (uid, username) => {
  const user = await userRepository.findByUsername(username);

  if (user) {
    return { success: false, message: "El nombre de usuario ya existe." };
  }

  await userRepository.updateUsernameById(uid, username);
  const token = await generateToken(uid, username);
  const refreshToken = await generateRefreshToken(uid, username);

  return {
    success: true,
    token,
    refreshToken,
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
  };
};
const updateUserPhotoUrl = async (userId, photoUrl) => {
  return await userRepository.updatePhotoUrl(userId, photoUrl);
};

const createUser = async ({ email, password, username }) => {
  // Comprobar si el usuario ya existe
  let user = await userRepository.findByEmail(email);

  if (user) {
    return {
      status: 400,
      response: { ok: false, message: "Un usuario existe con ese email" },
    };
  }

  user = await userRepository.findByUsername(username);
  if (user) {
    return {
      status: 400,
      response: {
        ok: false,
        message: "El nombre de usuario ya existe, elige otro.",
      },
    };
  }

  // Crear y guardar el usuario
  const salt = bcrypt.genSaltSync();
  const hashedPassword = bcrypt.hashSync(password, salt);
  user = await userRepository.create({
    email,
    password: hashedPassword,
    username,
  });

  // Generar token y enviarlo como respuesta
  const token = await generateToken(user.id, user.username);
  const refreshToken = await generateRefreshToken(user.id, user.username);
  return {
    status: 201,
    response: {
      payload: {
        username: user.username,
        uid: user._id,
        reputation: user.reputation,
      },
      ok: true,
      msg: "user created",
      token,
      refreshToken,
    },
  };
};

module.exports = {
  changeUsername,
  setUsername,
  createUser,
  updateUserPhotoUrl,
  getUserInfo,
  sentFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getFriendRequests,
  getIsFriend,
  checkFriendRequest,
  cancelFriendRequest,
  updateOpenedFriendRequests,
  getFriendList,
};
