import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import { uploadAudioToS3 } from "../utils/s3Upload.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, messageType, fileName } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    console.log("Sending message:", {
      messageType,
      fileName,
      messageLength: message?.length,
    });

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
      try {
        console.log("Uploading audio to S3...");
        msgContent = await uploadAudioToS3(
          message,
          fileName || `audio_${Date.now()}.webm`
        );
        console.log("Audio uploaded successfully:", msgContent);
      } catch (uploadError) {
        console.error("Audio upload failed:", uploadError);
        return res.status(500).json({ error: "Failed to upload audio file" });
      }
    }

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
