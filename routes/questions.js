const { Router } = require("express");
const {
  createQuestion,
  voteQuestion,
  getAllQuestions,
  getAllQuestionsPublic,
} = require("../controllers/question");
const { questionValidationSchema } = require("../schemas/question");
const { validateQuestion } = require("../middlewares/questionValidator");
const { validarJWT } = require("../middlewares/validateToken");
const { validateHcaptcha } = require("../middlewares/validateCaptcha");

const router = Router();

router.post(
  "/create",
  [validarJWT, validateHcaptcha, validateQuestion(questionValidationSchema)],
  createQuestion
);
router.get("/public", getAllQuestionsPublic);
router.get("/", validarJWT, getAllQuestions);
router.patch("/vote", validarJWT, voteQuestion);

module.exports = router;
