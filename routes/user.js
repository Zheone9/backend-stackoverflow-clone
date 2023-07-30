const { Router } = require("express");
const {
  loginUser,
  renewToken,
  loginWithGoogle,
  logout,
} = require("../controllers/authController");
const { createUser, uploadImage } = require("../controllers/userController");
const { validateUser } = require("../middlewares/userValidator");
const { validarJWT } = require("../middlewares/validateToken");
const { userValidationSchema } = require("../schemas/auth");
const {
  loginLimiter,
  registerLimiter,
  logoutLimiter,
} = require("../middlewares/rateLimiter");

const router = Router();

router.post(
  "/",
  [loginLimiter, validateUser(userValidationSchema, true)],
  loginUser
);
router.post(
  "/new",
  [registerLimiter, validateUser(userValidationSchema)],
  createUser
);
router.get("/renew", validarJWT, renewToken);
router.post("/google", loginWithGoogle);
router.post("/logout", logoutLimiter, logout);

module.exports = router;
