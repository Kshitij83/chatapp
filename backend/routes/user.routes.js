import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSideBar, getConversationsForSidebar, updateProfile, deleteAccount } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSideBar);
router.get("/conversations", protectRoute, getConversationsForSidebar);
router.put("/update-profile", protectRoute, updateProfile);
router.delete("/delete-account", protectRoute, deleteAccount);

export default router;