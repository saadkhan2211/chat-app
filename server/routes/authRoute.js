const express = require("express");
const router = express.Router();
const multer = require("multer");

const { signup, login } = require("../controller/authController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, "profile-" + Date.now() + "." + file.originalname.split(".")[1]);
  },
});

const upload = multer({ storage: storage });

router.use("uploads", express.static("uploads"));

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
