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
        playerId: playerId,
        roomId: roomId
    }

    type Response = {
        players: { id: number, name: string } []
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {
        const room = roomDB.tryGetRoom(request.roomId)
        if (room === null) {
            client.sendError("lobby/players", UniversalErrors.ROOM_NOT_FOUND)
            return roomDB
        }

        if (room instanceof Lobby) {
            const response: Response = {players: Array.from(room.getPlayers())}
            client.send("lobby/players", response)
        } else {
            client.sendError("lobby/players", Errors.ROOM_NOT_LOBBY)
        }

        return roomDB
    }

}
