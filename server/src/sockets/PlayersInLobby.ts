import {playerId, roomId} from "../domain"
import {RoomDB} from "../RoomDB";
import {Lobby} from "../Lobby";
import {SocketClient} from "./SocketClient";
import {UniversalErrors} from "./UniversalErrors";

export module PlayersInLobby {

    enum Errors {
        ROOM_NOT_LOBBY = 10
    }


    type Request = {
        playerId: playerId | undefined,
        roomId: roomId | undefined
    }

    type Response = {
        players: { id: number, name: string } []
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {

        if (request.playerId === undefined || request.roomId === undefined) {
            client.sendError("server/join", UniversalErrors.BAD_MESSAGE)
            return roomDB
        }

        const lobby = roomDB.tryGetLobby(request.roomId)
        if (lobby === null) {
            client.sendError("lobby/players", UniversalErrors.ROOM_NOT_FOUND)
            return roomDB
        }

        const response: Response = {players: Array.from(lobby.getPlayers())}
        client.send("lobby/players", response)

        return roomDB
    }

}
