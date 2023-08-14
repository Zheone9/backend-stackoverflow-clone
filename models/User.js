const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    sparse: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  reputation: {
    type: Number,
    default: 0,
  },
  profileImageUrl: {
    type: String,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  lastLoginDate: {
    type: Date,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  usernameIsSet: {
    type: Boolean,
    default: true,
  },
  picture: {
    type: String,
    default: null,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequestsReceived: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequestsSent: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

UserSchema.methods.toJSON = function () {
  const { __v, _id, password, ...user } = this.toObject();
  user.uid = _id;

  return user;
};

module.exports = model("User", UserSchema);
