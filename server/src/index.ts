import express from "express";
import {createServer} from "http";
import {Server} from "socket.io"
import {HostMsg, HostResponse} from "./msgs";
import * as ManageRooms from "./ManageRooms"
import * as PlayerId from "./PlayerId"
import {RoomDB} from "./domain";

const port = 3000

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
})

let roomDB = ManageRooms.EMPTY_DB

function mapRoomDB<TOut>(map: ((db: RoomDB) => [RoomDB, TOut])) {
    const [newDB, output] = map(roomDB)
    roomDB = newDB
    return output
}

// HTTP

app.get('/ping', (req, res) => {
    res.send('pong');
});

// SOCKET.IO

io.on("connection", socket => {
    socket.on("server/host", (msg: HostMsg) => {
        const player = {id: PlayerId.HOST, name: msg.playerName}
        const room = mapRoomDB(db => ManageRooms.openNewFor(player, db))
        const response: HostResponse = {playerId: player.id, roomId: room.id}
        socket.emit("me/host", response)
    })
})

httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
