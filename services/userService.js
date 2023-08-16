const userRepository = require("../repositories/userRepository");
const { generateToken } = require("../helpers/jwt");
const bcrypt = require("bcryptjs");

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

  const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    httpOnly: true,
  };

  return { success: true, token, cookieOptions };
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
  return { success: true, message: "Solicitud de amistad enviada." };
};

const setUsername = async (uid, username) => {
  const user = await userRepository.findByUsername(username);

  if (user) {
    return { success: false, message: "El nombre de usuario ya existe." };
  }

  await userRepository.updateUsernameById(uid, username);
  const token = await generateToken(uid, username);

  const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    httpOnly: true,
  };

  return { success: true, token, cookieOptions };
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
