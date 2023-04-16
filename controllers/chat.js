import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

//Create a new chat
export const createChat = async (req, res) => {
  try {
    const newChat = new Chat(req.body);
    const savedChat = await newChat.save();

    await savedChat.populate("members");

    res.send({
      success: true,
      message: "Chat Created Successfully",
      data: savedChat,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Failed Creating Chat",
      error: err.message,
    });
  }
};

//get all chats of current user
export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      members: {
        $in: [req.user.id],
      },
    })
      .populate("members")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    res.send({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Failed fetching user chats",
      error: err.message,
    });
  }
};

export const clearUnreadMessages = async (req, res) => {
  try {
    //Find chat and update unread messages count to 0
    const chat = await Chat.findById(req.body.chat);
    if (!chat) {
      res.status(400).send({
        success: false,
        message: "Chat not found",
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      req.body.chat,
      {
        unreadMessages: 0,
      },
      { new: true }
    )
      .populate("members")
      .populate("lastMessage");

    //Find all unread messages of this chat and update them to read
    await Message.updateMany(
      {
        chat: req.body.chat,
        read: false,
      },
      {
        read: true,
      }
    );

    res.send({
      success: true,
      message: "Unread messages cleared successfully",
      data: updatedChat,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Failed clearing unread messages",
      error: err.message,
    });
  }
};
