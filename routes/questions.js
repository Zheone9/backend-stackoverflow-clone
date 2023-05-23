const { Router } = require("express");
const {
  createQuestion,
  voteQuestion,
  getAllQuestions,
  getAllQuestionsPublic,
  deleteQuestion,
} = require("../controllers/question");
const { questionValidationSchema } = require("../schemas/question");
const { validateQuestion } = require("../middlewares/questionValidator");
const { validarJWT } = require("../middlewares/validateToken");
const { validateHcaptcha } = require("../middlewares/validateCaptcha");
const {forumLimiter} = require("../middlewares/rateLimiter");

const router = Router();

router.post(
  "/create",
  [forumLimiter ,validarJWT, validateHcaptcha, validateQuestion(questionValidationSchema)],
  createQuestion
);
router.post("/", getAllQuestions);
router.patch("/vote", validarJWT, voteQuestion);
router.delete("/:uid", validarJWT, deleteQuestion);

module.exports = router;
