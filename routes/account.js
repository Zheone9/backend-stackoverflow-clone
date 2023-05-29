const { Router } = require("express");
const { validarJWT } = require("../middlewares/validateToken");
const {validateUsername} = require("../middlewares/accountChanges");
const {changeUsername, setUsername} = require("../controllers/userController");
const {usernameSchema} = require("../schemas/account");
const {validarJWTSetUsername} = require("../middlewares/validateJWTSetUsername");

const router = Router();

router.patch("/change-username", [validateUsername(usernameSchema),validarJWT], changeUsername);
router.patch("/set-username", [validateUsername(usernameSchema),validarJWTSetUsername], setUsername);



module.exports = router;
