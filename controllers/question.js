const Question = require("../models/Question");
const User = require("../models/User");
const mongoose = require("mongoose");

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate(
      "author",
      "reputation username -_id"
    );

    const modifiedQuestions = questions.map((question) => {
      // Convierte el objeto Mongoose a un objeto JSON
      const questionJSON = question.toObject();

      // Busca si tu _id está presente en el array voters
      const voter = questionJSON.voters.find(
        (voter) => voter._id.toString() === req.uid
      );

      // Si se encuentra el _id en el array voters, agrega la propiedad voted al objeto de la pregunta
      if (voter) {
        questionJSON.voted = voter.vote;
      } else {
        // Si el _id no está en el array voters, establece la propiedad voted en 0
        questionJSON.voted = 0;
      }

      // Elimina la propiedad voters
      delete questionJSON.voters;
      delete questionJSON.__v;
      questionJSON.uid = questionJSON._id;
      delete questionJSON._id;

      return questionJSON;
    });

    // Envía la respuesta JSON modificada

    return res.status(200).json({ modifiedQuestions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener las preguntas", error });
  }
};

const getAllQuestionsPublic = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "reputation username -_id")
      .select("-voters");

    return res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las preguntas" });
  }
};

const voteQuestion = async (req, res) => {
  try {
    const { questionId, vote } = req.body;

    if (
      typeof vote !== "number" ||
      vote < -1 ||
      vote > 1 ||
      !mongoose.Types.ObjectId.isValid(questionId)
    ) {
      return res.status(400).json({ message: "El voto no es válido" });
    }

    const question = await Question.findById(questionId);
    const userId = req.uid;

    const userHasVotedIndex = question.voters.findIndex((voter) =>
      voter.equals(userId)
    );
    console.log(userHasVotedIndex);
    const questionOwner = await User.findById(question.author);
    console.log(questionOwner);

    if (userHasVotedIndex >= 0) {
      const previousVote = question.voters[userHasVotedIndex].vote;
      if (previousVote === vote) {
        return res.status(400).json({ message: "El voto no es válido" });
      } else {
        // Cambiar el voto existente
        question.votes += vote;
        question.voters.splice(userHasVotedIndex, 1);

        questionOwner.reputation += vote;
      }
    } else {
      // Registrar un nuevo voto
      question.votes += vote;
      question.voters.push({ _id: userId, vote });
      questionOwner.reputation += vote;
    }
    await questionOwner.save();

    await question.save();
    res.status(200).json({ message: "Voto registrado con éxito" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error al votar la pregunta" });
  }
};

const createQuestion = async (req, res = response) => {
  try {
    if (!req.hCaptchaValid) {
      return res.status(400).json({
        message: "Error al verificar el captcha",
      });
    }

    const { title, body } = req.body;

    console.log(req.uid);
    const author = req.uid;

    const user = await User.findById(author);

    const newQuestion = new Question({
      title,
      body,
      author,
    });

    await newQuestion.save();
    user.questions.push(newQuestion._id);
    await user.save();

    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: "Error al crear la pregunta: " });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  voteQuestion,
  getAllQuestionsPublic,
};
