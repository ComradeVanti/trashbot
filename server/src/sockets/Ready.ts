import {Location, id} from "../domain"
import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {UniversalErrors} from "./UniversalErrors";

export module Ready {

    type Request = {
        playerId: id | undefined,
        roomId: id | undefined,
        location: Location | undefined
    }

    type Response = {}

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {
        if (request.playerId === undefined || request.roomId === undefined || request.location === undefined) {
            client.sendError("lobby/ready", UniversalErrors.BAD_MESSAGE)
            return roomDB
        }

        const dbWithGame = roomDB.startGameIn(request.roomId, request.location)
        client.sendToRoom(request.roomId, "lobby/ready", {})

        return dbWithGame
    }

}
