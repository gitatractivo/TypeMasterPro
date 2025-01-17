import express from "express";
import { createServer } from "http";
import WebSocket from "ws";
import { RoomManager } from "./services/RoomManager";
import { User } from "./models/User";
import { MessageType } from "./types";

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });
const roomManager = new RoomManager();

const PORT = process.env.PORT || 8080;

// Sample typing texts
const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "To be or not to be, that is the question.",
  "All that glitters is not gold.",
  // Add more texts as needed
];

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

wss.on("connection", (ws: WebSocket) => {
  let user: User | null = null;

  ws.on("message", (message: string) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case MessageType.CREATE_ROOM: {
          if (!user) {
            user = new User(data.payload.name, ws);
          }
          const randomText = texts[Math.floor(Math.random() * texts.length)];
          const room = roomManager.createRoom(randomText);
          roomManager.joinRoom(room.id, user);
          user.sendMessage("room_created", { roomId: room.id });
          break;
        }

        case MessageType.JOIN_ROOM: {
          if (!user) {
            user = new User(data.payload.name, ws);
          }
          const success = roomManager.joinRoom(data.payload.roomId, user);
          if (!success) {
            user.sendMessage("error", { message: "Failed to join room" });
          }
          break;
        }

        case MessageType.START_GAME: {
          if (user?.roomId) {
            const room = roomManager.getRoom(user.roomId);
            if (room) {
              room.startGame();
            }
          }
          break;
        }

        case MessageType.UPDATE_PROGRESS: {
          if (user?.roomId) {
            const room = roomManager.getRoom(user.roomId);
            if (room) {
              room.updateUserProgress(
                user.id,
                data.payload.progress,
                data.payload.wpm
              );
            }
          }
          break;
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          payload: { message: "Invalid message format" },
        })
      );
    }
  });

  ws.on("close", () => {
    if (user) {
      roomManager.cleanupUser(user);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
