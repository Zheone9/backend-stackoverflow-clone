const { Schema, model } = require("mongoose");

const questionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  votes: {
    type: Number,
    default: 0,
  },
  voters: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      vote: {
        type: Number,
        default: 0,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
questionSchema.methods.toJSON = function () {
  const { __v, _id, ...question } = this.toObject();
  question.uid = _id;
  return question;
};
module.exports = model("Question", questionSchema);
