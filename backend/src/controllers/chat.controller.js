import { generateStreamToken, upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";

export async function getStreamToken(req, res) {
  try {
    if (req.user) {
      await upsertStreamUser({
        id: req.user._id.toString(),
        name: req.user.fullName,
        image: req.user.profilePic || "",
      });
    }

    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function prepareChat(req, res) {
  try {
    const { targetUserId } = req.params;
    const authUser = req.user;

    // 1. Ensure current user is in Stream
    await upsertStreamUser({
      id: authUser._id.toString(),
      name: authUser.fullName,
      image: authUser.profilePic || "",
    });

    // 2. Ensure target user exists and is in Stream
    const targetUser = await User.findById(targetUserId).select("-password");
    if (!targetUser) {
      return res.status(404).json({ message: "Chat partner not found in database" });
    }

    await upsertStreamUser({
      id: targetUser._id.toString(),
      name: targetUser.fullName,
      image: targetUser.profilePic || "",
    });

    // 3. Generate token for authUser
    const token = generateStreamToken(authUser._id);

    // 4. Clean channelId format
    const channelId = [authUser._id.toString(), targetUser._id.toString()].sort().join("-");

    res.status(200).json({
      token,
      channelId,
      targetUser: {
        _id: targetUser._id,
        fullName: targetUser.fullName,
        profilePic: targetUser.profilePic,
        nativeLanguage: targetUser.nativeLanguage,
        learningLanguage: targetUser.learningLanguage,
        location: targetUser.location,
        bio: targetUser.bio,
      },
    });
  } catch (error) {
    console.error("Error in prepareChat controller:", error.message);
    res.status(500).json({ message: "Failed to initialize chat session" });
  }
}
