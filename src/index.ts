import { WebSocketServer ,WebSocket} from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server started on port 8080");

let userCount = 0;
let allSockets: WebSocket[] = [];
wss.on("connection", (socket) => {
    allSockets.push(socket)
    userCount++;
    console.log("User Connected #" + userCount);

    socket.on("message",(message) => {
        console.log("Message recived" + message.toString());
        for(let i = 0;i<allSockets.length;i++){
            const s = allSockets[i];
            socket.send(message.toString() + "sent from server");
        }
    })
});