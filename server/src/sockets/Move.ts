import {Location, playerId, roomId} from "../domain"
import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {UniversalErrors} from "./UniversalErrors";
import {InGame} from "../InGame";

export module Move {

    enum Errors {
        NOT_IN_GAME = 10
    }

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

        const room = roomDB.tryGetRoom(request.roomId)

        if (!room) {
            client.sendError("me/location", UniversalErrors.ROOM_NOT_FOUND)
            return roomDB
        }

        if (room instanceof InGame) {
            roomDB.updateRoom(request.roomId, room.movePlayer(request.playerId, request.location))
            return roomDB
        } else {
            client.sendError("me/location", Errors.NOT_IN_GAME)
            return roomDB
        }
    }

}
