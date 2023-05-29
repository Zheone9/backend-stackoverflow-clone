const Question = require('../models/Question');
const User = require('../models/User');
const mongoose = require('mongoose');

const getAllQuestions = async () => {
    return Question.find().populate('author', 'reputation username picture');
};

const modifyQuestion = (question, userId) => {
    const questionJSON = question.toObject();

    const voter = questionJSON.voters.find((voter) => voter._id.toString() === userId);

    if (voter) {
        questionJSON.voted = voter.vote;
    } else {
        questionJSON.voted = 0;
    }

    delete questionJSON.voters;
    delete questionJSON.__v;
    questionJSON.uid = questionJSON._id;
    delete questionJSON._id;
    questionJSON.author.uid = questionJSON.author._id;
    delete questionJSON.author._id;
    return questionJSON;
};





const voteQuestion = async (userId, questionId, vote) => {
    if (
        typeof vote !== "number" ||
        vote < -1 ||
        vote > 1 ||
        !mongoose.Types.ObjectId.isValid(questionId)
    ) {
        return { success: false, message: "El voto no es válido" };
    }

    const question = await Question.findById(questionId);
    const userHasVotedIndex = question.voters.findIndex((voter) => voter.equals(userId));
    const questionOwner = await User.findById(question.author);

    if (userHasVotedIndex >= 0) {
        const previousVote = question.voters[userHasVotedIndex].vote;
        if (previousVote === vote) {
            return { success: false, message: "El voto no es válido" };
        } else {
            question.votes += vote;
            question.voters.splice(userHasVotedIndex, 1);
            questionOwner.reputation += vote;
        }
    } else {
        question.votes += vote;
        question.voters.push({ _id: userId, vote });
        questionOwner.reputation += vote;
    }

    await questionOwner.save();
    await question.save();

    return { success: true };
};

const deleteQuestion = async (uid, authorId) => {
    const question = await Question.findById(uid);

    if (question.author._id.toHexString() !== authorId) {
        return { success: false, message: "Unathorized" };
    }

    await Question.findByIdAndDelete(uid);
    await User.findByIdAndUpdate(
        authorId,
        { $pull: { questions: uid } },
        { new: true }
    );

    return { success: true };
};

const createQuestion = async (title, body, author) => {
    const user = await User.findById(author);

    const newQuestion = new Question({
        title,
        body,
        author,
    });
    newQuestion.voters.push({ _id: user._id, vote: 1 });

    await newQuestion.save();
    user.questions.push(newQuestion._id);
    await user.save();

    return newQuestion;
};

module.exports = {
    getAllQuestions,
    modifyQuestion,
    voteQuestion,
    deleteQuestion,
    createQuestion,
};