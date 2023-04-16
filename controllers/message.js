import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

//Send a new message
export const sendMessage = async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();

    //update last message of chat
    await Chat.findOneAndUpdate(
      { _id: req.body.chat },
      {
        lastMessage: savedMessage._id,
        $inc: {
          unreadMessages: 1,
        },
      }
    );

    res.send({
      success: true,
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Error sending message",
      error: err.message,
    });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    }).sort({ createdAt: 1 });

    res.send({
      success: true,
      message: "Messages fetched Successfully",
      data: messages,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Error fetching messages",
      error: err.message,
    });
  }
};
