import "./polyfill.js";

import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import { setupMatchmaking } from "./lib/matchmaking.js";

const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow frontend to send cookies
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Create HTTP server & attach Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

setupMatchmaking(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
