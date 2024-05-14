const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  getRoom,
  getChats,
  // createChatRoom,
  getRooms,
  uploadImage,
} = require("../controller/chatController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const filename = req.body.filename; // Retrieve filename from request body
    cb(null, filename); // Use the specified filename
  },
});

const upload = multer({ storage: storage });

router.use("/uploads", express.static("uploads"));

router.get("/fetchRoom/:id", getRoom);
router.post("/uploadImage", upload.single("chat"), uploadImage);
router.get("/chats/:id", getChats);
router.get("/fetchRooms", getRooms);

module.exports = router;
