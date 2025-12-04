const express = require("express");
const router = express.Router();
const {registeredUsers, loginUser, logoutUser}  = require('../controllers/authController')


router.get("/", function (req, res) {
  res.send("Hello!!");
});

router.post("/register", registeredUsers );

router.post("/login", loginUser)

router.post("/logout", logoutUser)

module.exports = router;
