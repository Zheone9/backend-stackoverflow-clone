const { Router } = require("express");
const {
  getUserInfo,
  sentFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getFriendRequests,
  getIsFriend,
  checkFriendRequest,
  cancelFriendRequest,
  updateOpenedFriendRequests,
  getFriendList,
} = require("../controllers/userController");
const { validarJWT } = require("../middlewares/validateToken");

const router = Router();

router.get("/get-user/:username", getUserInfo);
router.post("/send-friend-request/:username", validarJWT, sentFriendRequest);
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
router.delete("/remove-friend/:username", validarJWT, removeFriend);
router.get("/get-friend-requests", validarJWT, getFriendRequests);
router.get("/is-friend/:username/", validarJWT, getIsFriend);
router.get("/check-friend-request/:username", validarJWT, checkFriendRequest);
router.delete(
  "/cancel-friend-request/:username",
  validarJWT,
  cancelFriendRequest
);
router.post("/open-friend-requests", validarJWT, updateOpenedFriendRequests);
router.get("/get-friendList", validarJWT, getFriendList);

module.exports = router;
