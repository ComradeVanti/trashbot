import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import {RoomDB} from "./RoomDB";
import {Host} from "./sockets/Host";
import {Join} from "./sockets/Join";
import {makeSocketClient, SocketClient} from "./sockets/SocketClient";
import {GetActors} from "./sockets/GetActors";
import {PlayersInLobby} from "./sockets/PlayersInLobby";
import {Ready} from "./sockets/Ready";
import {Move} from "./sockets/Move";
import * as dotenv from "dotenv";
import {PickUp} from "./sockets/PickUp";
import {GetRobot} from "./sockets/GetRobot";

dotenv.config();
const port = parseInt(process.env.PORT || "3000");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

let roomDB = RoomDB.EMPTY;

// HTTP

app.get("/ping", (req, res) => {
    res.send("pong");
});

// SOCKET.IO

io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected`);

    const client = makeSocketClient(io, socket);

    socket.onAny((event, request) => {
        console.log(`Socket ${socket.id} -> Server ${event}`);

        function handleWith(
            handleFunc: (request: any, db: RoomDB, client: SocketClient) => RoomDB
        ) {
            roomDB = handleFunc(request, roomDB, client);
        }

        switch (event) {
            case "server/host":
                return handleWith(Host.handle);
            case "server/join":
                return handleWith(Join.handle);
            case "lobby/players":
                return handleWith(PlayersInLobby.handle);
            case "lobby/ready":
                return handleWith(Ready.handle);
            case "game/location":
                return handleWith(Move.handle);
            case "game/get-actors":
                return handleWith(GetActors.handle);
            case"game/pick-up-item":
                return handleWith(PickUp.handle);
            case "game/robot":
                return handleWith(GetRobot.handle);
            default:
                return console.log(`Unknown event from ${socket.id}: ${event}`);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected`);
    });
});

httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
