const express = require("express");
const router = express.Router();

const UsersCtrl = require("../controllers/users");
const AuthCtrl = require("../controllers/auth");

router.get("/getUsers", AuthCtrl.onlyAuthUser, UsersCtrl.getUsers);

router.post("/register", UsersCtrl.register);

router.post("/login", UsersCtrl.login);
router.post("/logout", UsersCtrl.logout);
router.get("/me", AuthCtrl.onlyAuthUser, UsersCtrl.getCurrentUser);
router.get("/me/joinedMeetups", AuthCtrl.onlyAuthUser, UsersCtrl.getJoinedMeetups);
router.get("/me/activity", AuthCtrl.onlyAuthUser, UsersCtrl.getUserActivity);
router.patch("/:id", AuthCtrl.onlyAuthUser, UsersCtrl.updateUser);
router.patch("/:hash/activate", UsersCtrl.activateUser);
router.delete("/:id", AuthCtrl.onlyAuthUser, UsersCtrl.deleteUser);

module.exports = router;
