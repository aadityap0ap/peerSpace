"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
console.log("WebSocket server started on port 8080");
let userCount = 0;
wss.on("connection", (socket) => {
    userCount++;
    console.log("User Connected #" + userCount);
});
//# sourceMappingURL=index.js.map