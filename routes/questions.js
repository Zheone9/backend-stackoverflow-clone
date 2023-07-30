const { Router } = require("express");
const {
  createQuestion,
  voteQuestion,
  getAllQuestions,
  deleteQuestion,
  addComment,
} = require("../controllers/questionController");
const { questionValidationSchema } = require("../schemas/question");
const { validateSchema } = require("../middlewares/questionValidator");
const { validarJWT } = require("../middlewares/validateToken");
const { validateHcaptcha } = require("../middlewares/validateCaptcha");
const { forumLimiter } = require("../middlewares/rateLimiter");
const { commentValidationSchema } = require("../schemas/questionComment");

const router = Router();

router.post(
  "/create",
  [
    forumLimiter,
    validarJWT,
    validateHcaptcha,
    validateSchema(questionValidationSchema),
  ],
  createQuestion
);
router.post("/", getAllQuestions);
router.patch("/vote", validarJWT, voteQuestion);
router.delete("/:uid", validarJWT, deleteQuestion);
router.post(
  "/addComment",
  validarJWT,
  validateSchema(commentValidationSchema),
  addComment
);

module.exports = router;
