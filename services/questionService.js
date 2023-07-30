const questionRepository = require("../repositories/questionRepository");

const getAllQuestions = async (userId) => {
  const questions = await questionRepository.getAllQuestions();
  return questions.map((question) =>
    questionRepository.modifyQuestion(question, userId)
  );
};

const voteQuestion = async (userId, questionId, vote) => {
  return await questionRepository.voteQuestion(userId, questionId, vote);
};
const addComment = async (questionId, body, authorId) => {
  return await questionRepository.addComment(questionId, body, authorId);
};

const deleteQuestion = async (uid, authorId) => {
  return await questionRepository.deleteQuestion(uid, authorId);
};

const createQuestion = async (title, body, author) => {
  return await questionRepository.createQuestion(title, body, author);
};

module.exports = {
  getAllQuestions,
  voteQuestion,
  deleteQuestion,
  createQuestion,
  addComment,
};
