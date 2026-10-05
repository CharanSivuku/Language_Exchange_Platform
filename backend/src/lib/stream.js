import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY || process.env.STEAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET || process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.warn("⚠️ Stream API key or Secret is missing. Stream chat and video features will not work until set in .env.");
}

const streamClient = apiKey && apiSecret ? StreamChat.getInstance(apiKey, apiSecret) : null;

export const upsertStreamUser = async (userData) => {
  if (!streamClient) {
    console.warn("Stream client is not initialized. Skipping upsertStreamUser.");
    return userData;
  }
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  if (!streamClient) {
    console.warn("Stream client is not initialized. Cannot generate Stream token.");
    return null;
  }
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
    return null;
  }
};
