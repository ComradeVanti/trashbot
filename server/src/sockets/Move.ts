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
        playerId: playerId,
        roomId: roomId,
        location: Location
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {
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
