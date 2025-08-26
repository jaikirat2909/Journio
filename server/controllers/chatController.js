const Chat = require("../models/chatModel");

// ✅ Fetch all chats
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
};

module.exports = { getAllChats };
