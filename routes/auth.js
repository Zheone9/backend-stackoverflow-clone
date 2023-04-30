const { Router } = require("express");
const {
  createUser,
  loginUser,
  renewToken,
  loginWithGoogle, logout,
} = require("../controllers/auth");
const { validateUser } = require("../middlewares/userValidator");
const { validarJWT } = require("../middlewares/validateToken");
const { userValidationSchema } = require("../schemas/auth");

const router = Router();

router.post("/", [validateUser(userValidationSchema, true)], loginUser);
router.post("/new", [validateUser(userValidationSchema)], createUser);
router.get("/renew", validarJWT, renewToken);
router.post("/google", loginWithGoogle);
router.post('/logout',logout);

module.exports = router;
