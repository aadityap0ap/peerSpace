import { WebSocketServer, WebSocket } from "ws";

interface User {
  socket: WebSocket;
  room: string;
}

const allSockets: User[] = [];

export function setupChat(wss: WebSocketServer) {
  wss.on("connection", (socket) => {
    console.log("User connected");
    socket.on("message", (message) => {
      const parsedMessage = JSON.parse(message.toString());
      if (parsedMessage.type === "Join") {
        allSockets.push({
          socket,
          room: parsedMessage.payload.roomId,
        });
        console.log(`User joined room ${parsedMessage.payload.roomId}`);
      }

      // Send Chat
      if (parsedMessage.type === "chat") {
        let currentUserRoom: string | null = null;
        // Find sender's roomd
        for (const user of allSockets) {
          if (user.socket === socket) {
            currentUserRoom = user.room;
            break;
          }
        }
        if (!currentUserRoom) return;
        // Broadcast to everyone in the same room
        for (const user of allSockets) {
          if (user.room === currentUserRoom) {
            user.socket.send(parsedMessage.payload.message);
          }
        }
      }
    });

    // Remove disconnected user
    socket.on("close", () => {
      const index = allSockets.findIndex(
        (user) => user.socket === socket
      );
      if (index !== -1) {
        allSockets.splice(index, 1);
      }
      console.log("User disconnected");
    });
  });
}