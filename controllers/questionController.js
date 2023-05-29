const questionService = require('../services/questionService');

const getAllQuestions = async (req, res) => {
  try {
    const userId = req.body.userId;
    const questions = await questionService.getAllQuestions(userId);

    return res.status(200).json({ questions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener las preguntas", error });
  }
};

const voteQuestion = async (req, res) => {
  try {
    const { questionId, vote } = req.body;
    const userId = req.uid;

    const result = await questionService.voteQuestion(userId, questionId, vote);

    if (result.success) {
      res.status(200).json({ message: "Voto registrado con éxito" });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error al votar la pregunta" });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { uid } = req.params;
    const authorId = req.uid;

    const result = await questionService.deleteQuestion(uid, authorId);

    if (result.success) {
      res.status(200).json({ message: "Question deleted successfully" });
    } else {
      res.status(401).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete question" });
  }
};

const createQuestion = async (req, res) => {
  try {
    if (!req.hCaptchaValid) {
      return res.status(400).json({
        message: "Error al verificar el captcha",
      });
    }

    const { title, body } = req.body;
    const author = req.uid;

    const newQuestion = await questionService.createQuestion(title, body, author);

    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: "Error al crear la pregunta: " });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  voteQuestion,
  deleteQuestion,
};