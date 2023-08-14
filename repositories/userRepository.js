const User = require("../models/User");

const findByUsername = (username) => {
  return User.findOne({ username });
};
const removeFriend = async (uid, friendId) => {
  await User.findByIdAndUpdate(
    uid,
    { $pull: { friends: friendId } },
    { new: true }
  );
  await User.findByIdAndUpdate(
    friendId,
    { $pull: { friends: uid } },
    { new: true }
  );
};

const declineFriendRequest = async (uid, friendId) => {
  await User.findByIdAndUpdate(
    uid,
    { $pull: { friendRequestsReceived: friendId } },
    { new: true }
  );
  await User.findByIdAndUpdate(
    friendId,
    { $pull: { friendRequestsSent: uid } },
    { new: true }
  );
};

const findByEmail = (email) => {
  return User.findOne({ email });
};
const acceptFriendRequest = async (uid, friendId) => {
  await User.findByIdAndUpdate(
    uid,
    {
      $push: { friends: friendId },
      $pull: { friendRequestsReceived: friendId },
    },
    { new: true }
  );
  await User.findByIdAndUpdate(
    friendId,
    {
      $push: { friends: uid },
      $pull: { friendRequestsSent: uid },
    },
    { new: true }
  );
};

const sentFriendRequest = async (uid, friendId) => {
  await User.findByIdAndUpdate(
    uid,
    { $push: { friendRequestsSent: friendId } },
    { new: true }
  );
  await User.findByIdAndUpdate(
    friendId,
    { $push: { friendRequestsReceived: uid } },
    { new: true }
  );
};

const updateUsername = (uid, oldUsername, newUsername) => {
  return User.findOneAndUpdate(
    { _id: uid, username: oldUsername },
    { username: newUsername },
    { new: true }
  );
};
const create = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};
const updateUsernameById = (uid, username) => {
  return User.findByIdAndUpdate(
    uid,
    { username, usernameIsSet: true },
    { new: true }
  );
};

const findById = (uid) => {
  return User.findById(uid);
};
const updatePhotoUrl = async (userId, photoUrl) => {
  return await User.findByIdAndUpdate(
    userId,
    { picture: photoUrl },
    { new: true }
  );
};
module.exports = {
  findByEmail,
  create,
  findByUsername,
  updateUsername,
  updateUsernameById,
  updatePhotoUrl,
  sentFriendRequest,
  findById,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
};
