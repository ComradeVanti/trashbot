import {playerId, roomId} from "../domain"
import {RoomDB} from "../RoomDB";
import {Lobby} from "../Lobby";
import {SocketClient} from "./SocketClient";
import {UniversalErrors} from "./UniversalErrors";

export module Host {

    enum Errors {
        BAD_NAME = 10
    }

    type Request = {
        playerName: string | undefined
    }

    type Response = {
        playerId: playerId
        roomId: roomId
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {
        if(request.playerName === undefined)
        {
            client.sendError("server/host", UniversalErrors.BAD_MESSAGE)
            return roomDB
        }

        const [room, playerId] = Lobby.newWithHost(request.playerName)
        const [dbWithLobby, roomId] = roomDB.add(room)

        client.joinRoom(roomId)

        const response: Response = {playerId, roomId}
        client.send("me/host", response)

        return dbWithLobby
    }

}
