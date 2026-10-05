import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken, prepareChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
router.post("/prepare/:targetUserId", protectRoute, prepareChat);

export default router;
