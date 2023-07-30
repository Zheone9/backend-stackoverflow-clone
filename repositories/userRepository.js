const User = require("../models/User");

const findByUsername = (username) => {
  return User.findOne({ username });
};

const findByEmail = (email) => {
  return User.findOne({ email });
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
};
