"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type == 'Join') {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
        }
        if (parsedMessage.type == "chat") {
            let currentUserRoom = null;
            for (let i = 0; i < allSockets.length; i++) {
                const user = allSockets[i];
                if (user && user.socket === socket) {
                    currentUserRoom = user.room;
                }
            }
            for (let i = 0; i < allSockets.length; i++) {
                const user = allSockets[i];
                if (user && user.room === currentUserRoom) {
                    user.socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
});
//# sourceMappingURL=index.js.map