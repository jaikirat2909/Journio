const express = require("express");
const router = express.Router();
const { getAllChats } = require("../controllers/chatController");

// Route to fetch all chats
router.get("/", getAllChats);

module.exports = router;
