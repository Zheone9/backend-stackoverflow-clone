const { Router } = require("express");
const { getUserInfo } = require("../controllers/userController");

const router = Router();

router.get("/:username", getUserInfo);

module.exports = router;
