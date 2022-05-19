import {Entity, id} from "../domain"
import {RoomDB} from "../RoomDB";
import {Guest} from "../Lobby";
import {SocketClient} from "./SocketClient";
import {UniversalError} from "./UniversalError";

export module PlayersInLobby {

    enum Errors {
        ROOM_NOT_LOBBY = 10
    }


    type Request = {
        playerId: id | undefined,
        roomId: id | undefined
    }

    type Response = {
        players: Entity<Guest> []
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {

        if (request.playerId === undefined || request.roomId === undefined) {
            client.sendError("server/join", UniversalError.BAD_MESSAGE)
            return roomDB
        }

        const lobby = roomDB.tryGetLobby(request.roomId)
        if (lobby === null) {
            client.sendError("lobby/players", UniversalError.ROOM_NOT_FOUND)
            return roomDB
        }

        const response: Response = {players: lobby.guestsWithId}
        client.send("lobby/players", response)

        return roomDB
    }

}
