import express from "express";
import {createServer} from "http";
import {Server} from "socket.io"

const port = 3000

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer)

// HTTP

app.get('/ping', (req, res) => {
    res.send('pong');
});

// SOCKET.IO

io.on("connection", socket => {
    socket.on("server/host", (msg: HostMsg) => {
        const playerId = socket.id
        const roomId = "1234"
        const response: HostResponse = {playerId, roomId}
        socket.emit("me/host", response)
    })
})

httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
