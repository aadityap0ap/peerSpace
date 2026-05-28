import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server started on port 8080");

let userCount = 0;

wss.on("connection", (socket) => {
    userCount++;
    console.log("User Connected #" + userCount);
});