import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

export const getConversationsForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    const conversations = await Promise.all(
      users.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: { $all: [userId, user._id] },
        }).populate("messages");

        const messages = conversation?.messages || [];
        const lastMessage = messages.length
          ? messages[messages.length - 1]
          : null;

        return {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          profilePic: user.profilePic,
          lastMessage: lastMessage
            ? {
                text: lastMessage.message,
                messageType: lastMessage.messageType,
                timestamp: lastMessage.createdAt || lastMessage.timestamp,
                senderId: lastMessage.senderId,
              }
            : null,
        };
      })
    );

    res.status(200).json(conversations);
  } catch (error) {
    console.log("Error in getConversationsForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("updateProfile called");
    console.log("Request body:", req.body);
    const userId = req.user._id;
    const { fullName, username } = req.body;

    if (!fullName || fullName.trim().length === 0) {
      console.log("Name is empty");
      return res.status(400).json({ error: "Name cannot be empty" });
    }
    if (!username || username.trim().length === 0) {
      console.log("Username is empty");
      return res.status(400).json({ error: "Username cannot be empty" });
    }

    // Check if username is being changed and if new username is unique
    const user = await User.findById(userId);
    console.log("User found:", user);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    if (user.username !== username) {
      const existingUser = await User.findOne({ username });
      console.log("Existing user with username:", existingUser);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
    }

    user.fullName = fullName;
    user.username = username;
    await user.save();

    console.log("Profile updated successfully");
    res.status(200).json({ fullName: user.fullName, username: user.username });
  } catch (error) {
    console.log("Error in updateProfile:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
