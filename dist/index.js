"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
console.log("WebSocket server started on port 8080");
let userCount = 0;
let allSockets = [];
wss.on("connection", (socket) => {
    allSockets.push(socket);
    userCount++;
    console.log("User Connected #" + userCount);
    socket.on("message", (message) => {
        console.log("Message recived" + message.toString());
        for (let i = 0; i < allSockets.length; i++) {
            const s = allSockets[i];
            socket.send(message.toString() + "sent from server");
        }
    });
});
//# sourceMappingURL=index.js.map