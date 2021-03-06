import {errorCode, id} from "../domain"
import {RoomDB} from "../RoomDB";
import {Lobby} from "../Lobby";
import {UniversalError} from "./UniversalError";
import {SocketClient} from "./SocketClient";

export module Join {

    enum Errors {
        BAD_NAME = 10,
        DUPLICATE_NAME = 11
    }

    type Request = {
        playerName: string | undefined,
        roomId: id | undefined
    }

    type Response = {
        playerId: number
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {

        if (request.roomId === undefined || request.playerName === undefined) {
            client.sendError("server/join", UniversalError.BAD_MESSAGE)
            return roomDB
        }

        const room = roomDB.tryGetLobby(request.roomId)
        if (room === null) {
            client.sendError("server/join", UniversalError.ROOM_NOT_FOUND)
            return roomDB
        }

        const [roomWithPlayer, playerId] = room.addGuest({name: request.playerName})
        const dbWithPlayer = roomDB.updateLobby(request.roomId, roomWithPlayer)

        client.sendToRoom(request.roomId, "lobby/changed", {playerId, action: "JOINED"})
        client.joinRoom(request.roomId)

        const response: Response = {playerId}
        client.send("me/join", response)
        return dbWithPlayer
    }

}
