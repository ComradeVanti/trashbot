import {id} from "../domain"
import {RoomDB} from "../RoomDB";
import {Lobby} from "../Lobby";
import {SocketClient} from "./SocketClient";
import {UniversalError} from "./UniversalError";

export module Host {

    enum Errors {
        BAD_NAME = 10
    }

    type Request = {
        playerName: string | undefined
    }

    type Response = {
        playerId: id
        roomId: id
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {
        if (request.playerName === undefined) {
            client.sendError("server/host", UniversalError.BAD_MESSAGE)
            return roomDB
        }

        const [lobby, playerId] = Lobby.newWithHost(request.playerName)
        const [dbWithLobby, roomId] = roomDB.addLobby(lobby)

        client.joinRoom(roomId)

        const response: Response = {playerId, roomId}
        client.send("me/host", response)

        return dbWithLobby
    }

}
