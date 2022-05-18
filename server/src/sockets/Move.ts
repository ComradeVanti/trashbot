import {Location, playerId, roomId} from "../domain"
import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {UniversalErrors} from "./UniversalErrors";
import {Game} from "../Game";

export module Move {

    type Request = {
        playerId: playerId | undefined,
        roomId: roomId | undefined,
        location: Location | undefined
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {

        if (request.playerId === undefined || request.roomId === undefined || request.location === undefined) {
            client.sendError("server/join", UniversalErrors.BAD_MESSAGE)
            return roomDB
        }

        const game = roomDB.tryGetGame(request.roomId)

        if (!game) {
            client.sendError("me/location", UniversalErrors.ROOM_NOT_FOUND)
            return roomDB
        }

        roomDB.updateGame(request.roomId, game.movePlayer(request.playerId, request.location))
        return roomDB
    }

}
