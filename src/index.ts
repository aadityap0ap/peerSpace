import { WebSocketServer ,WebSocket} from 'ws';
const wss = new WebSocketServer({ port: 8080 });

interface user{
    socket:WebSocket,
    room:string
}
let allSockets: user[]= [];
wss.on("connection", (socket) => {
    socket.on("message",(message) => {
        const parsedMessage = JSON.parse(message.toString());
        if(parsedMessage.type =='Join'){
            allSockets.push({
               socket,
               room: parsedMessage.payload.roomId,
        })
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
    })
});