const { Router } = require("express");
const { validarJWT } = require("../middlewares/validateToken");
const { validateUsername } = require("../middlewares/accountChanges");
const {
  changeUsername,
  setUsername,
  uploadImage,
} = require("../controllers/userController");
const { usernameSchema } = require("../schemas/account");
const {
  validarJWTSetUsername,
} = require("../middlewares/validateJWTSetUsername");
const upload = require("../middlewares/upload");

const router = Router();

router.patch(
  "/change-username",
  [validateUsername(usernameSchema), validarJWT],
  changeUsername
);
router.patch(
  "/set-username",
  [validateUsername(usernameSchema), validarJWTSetUsername],
  setUsername
);
router.post(
  "/upload-profile-picture",
  validarJWT,
  upload.single("image"),
  uploadImage
);

module.exports = router;
