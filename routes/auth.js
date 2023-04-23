const { Router } = require("express");
const { createUser, loginUser, renewToken } = require("../controllers/auth");
const { validateUser } = require("../middlewares/userValidator");
const { validarJWT } = require("../middlewares/validateToken");
const { userValidationSchema } = require("../schemas/auth");

const router = Router();

router.post("/", [validateUser(userValidationSchema, true)], loginUser);
router.post("/new", [validateUser(userValidationSchema)], createUser);
router.get("/renew", validarJWT, renewToken);

module.exports = router;
