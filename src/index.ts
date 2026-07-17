import express from "express";
import authRouter from "./routes/auth";
import roomRouter from "./routes/room";
import friendRouter from "./routes/friends"
import { ConnectDB } from "./db/db";
import { configDotenv } from "dotenv";
import cors from "cors";

import http from "http";
import { WebSocketServer } from "ws";
import { setupChat } from "./websockets/chat";

configDotenv();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use("/friend",friendRouter);

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach WebSocket server to the same HTTP server
const wss = new WebSocketServer({ server });

// Register chat handlers
setupChat(wss);

async function StartServer() {
  try {
    await ConnectDB();

    server.listen(3003, () => {
      console.log("Server running on port 3003");
    });
  } catch (error) {
    console.log("DB error occurred!");
  }
}

StartServer();