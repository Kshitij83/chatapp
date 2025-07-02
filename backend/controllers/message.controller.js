import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import { uploadAudioToS3 } from "../utils/s3Upload.js"; // You need to create this file as in Connectify

export const sendMessage = async (req, res) => {
  try {
    const { message, messageType, fileName } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    let msgContent = message;
    let msgType = messageType || "text";
    let msgFileName = fileName;

    // Handle audio upload to S3
    if (msgType === "audio" && message.startsWith("data:audio")) {
      msgContent = await uploadAudioToS3(
        message,
        fileName || `audio_${Date.now()}.webm`
      );
    }

    // For images, you can store base64 directly or use S3 similarly if needed

    const newMessage = new Message({
      senderId,
      receiverId,
      message: msgContent,
      messageType: msgType,
      fileName: msgFileName,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();
    //the above lines can be replaced with below line:
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
