const { Router } = require("express");
const {
  getUserInfo,
  sentFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} = require("../controllers/userController");
const { validarJWT } = require("../middlewares/validateToken");

const router = Router();

router.get("/:username", getUserInfo);
router.post("/sent-friend-request/:username", validarJWT, sentFriendRequest);
router.post(
  "/accept-friend-request/:username",
  validarJWT,
  acceptFriendRequest
);
router.post(
  "/decline-friend-request/:username",
  validarJWT,
  declineFriendRequest
);
router.post("/remove-friend/:username", validarJWT, removeFriend);

module.exports = router;
