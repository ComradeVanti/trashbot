import express from "express";
import {createServer} from "http";
import {Server} from "socket.io"
import {GetActorsMsg, GetActorsResponse, HostMsg, HostResponse, JoinMsg, JoinResponse} from "./msgs";
import {roomId} from "./domain";
import {Lobby} from "./Lobby";
import {RoomDB} from "./RoomDB";

const roomIdRegex = /(?<context>[a-z\d]+)\/(?<msg>[a-z-]+)/
const port = 3000

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
})

let roomDB = RoomDB.EMPTY

function mapRoomDB(map: ((db: RoomDB) => RoomDB)) {
    roomDB = map(roomDB)
}

function mapRoomDBOut<TOut>(map: ((db: RoomDB) => [RoomDB, TOut])) {
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

    console.log(`Socket ${socket.id} connected`)

    function registerRoomEvents(roomId: roomId) {
        socket.on(`${roomId}/get-actors`, (msg: GetActorsMsg) => {
            const response: GetActorsResponse = {
                actors: [
                    {
                        type: 0,
                        playerId: msg.playerId,
                        location: {
                            lat: 1,
                            lng: 2
                        }
                    }
                ]
            }
            socket.emit("me/actors", response)
        })
    }

    socket.on("server/host", (msg: HostMsg) => {
        const [room, playerId] = Lobby.newWithHost(msg.playerName)
        const roomId = mapRoomDBOut(it => it.add(room))

        registerRoomEvents(roomId)

        socket.to(roomId.toString())
        const response: HostResponse = {playerId, roomId}

        console.log(`Socket ${socket.id} is now the host of room ${roomId}`)
        socket.emit("me/host", response)
    })

    socket.on(`server/join`, (msg: JoinMsg) => {
        console.log(`Socket ${socket.id} tries to join room ${msg.roomId}`)
        const room = roomDB.tryGetRoom(msg.roomId)
        if (room === null) return socket.emit("me/join", {errorCode: 3})
        if (room instanceof Lobby) {
            const [roomWithPlayer, playerId] = room.addPlayer(msg.playerName)
            mapRoomDB(it => it.updateRoom(msg.roomId, roomWithPlayer))

            io.to(msg.roomId.toString()).emit("lobby/changed", {playerId, action: "JOINED"})

            socket.to(msg.roomId.toString())
            const response: JoinResponse = {
                playerId,
                playersInLobby: Array.from(roomWithPlayer.getPlayers())
            }
            socket.emit("me/join", response)
        } else
            socket.emit("me/join", {errorCode: 2})
    })

    socket.onAny(([event]) => {
        const match = roomIdRegex.exec(event)
        const context = match?.groups?.context || ""

        if (!isNaN(+context)) {
            const roomId = +context
            if (!roomDB.hasRoomWith(roomId))
                socket.emit("me/error", {errorCode: 0})
        }
    })
})

httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
