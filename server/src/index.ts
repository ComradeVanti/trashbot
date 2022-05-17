import express from "express";
import {createServer} from "http";
import {Server} from "socket.io"
import {GetActorsMsg, GetActorsResponse, HostMsg, HostResponse} from "./msgs";
import {roomId} from "./domain";
import {Lobby} from "./Lobby";
import {RoomDB} from "./RoomDB";

const port = 3000

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
})

let roomDB = RoomDB.EMPTY

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

    function registerRoomEvents(roomId: roomId) {
    }


    socket.on("server/host", (msg: HostMsg) => {
        const [room, playerId] = Lobby.newWithHost(msg.playerName)
        const roomId = mapRoomDB(it => it.add(room))

        registerRoomEvents(roomId)

        const response: HostResponse = {playerId, roomId}
        socket.emit("me/host", response)
    })
})

httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
