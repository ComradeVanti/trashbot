import express from "express";
import {createServer} from "http";
import {Server} from "socket.io"
import {HostMsg, HostResponse} from "./msgs";
import * as ManageRooms from "./ManageRooms"
import * as PlayerId from "./PlayerId"

const port = 3000

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer)

let roomDB = ManageRooms.EMPTY_DB

// HTTP

app.get('/ping', (req, res) => {
    res.send('pong');
});

// SOCKET.IO

io.on("connection", socket => {
    socket.on("server/host", (msg: HostMsg) => {
        const player = {id: PlayerId.HOST, name: msg.playerName}
        const [room, newDB] = ManageRooms.openNewFor(player, roomDB)
        roomDB = newDB
        console.log(JSON.stringify(roomDB.entries()))
        const response: HostResponse = {playerId: player.id, roomId: room.id}
        socket.emit("me/host", response)
    })
})

httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
