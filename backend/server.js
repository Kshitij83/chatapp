import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import db from "./db/db.js";

// Import the app and server from socket.js
import { app, server } from "./socket/socket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

const allowedOrigins = [
  "http://localhost:3000",
  "https://chatapp-i0cp.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Debug: log all incoming requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Do NOT serve frontend static files here if frontend is deployed separately

server.listen(PORT, () => {
  db();
  console.log(`Server Running on port ${PORT}`);
});
server.listen(PORT, () => {
  db();
  console.log(`Server Running on port ${PORT}`);
});
