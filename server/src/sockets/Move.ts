import {SphereXY, id} from "../domain"
import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {UniversalErrors} from "./UniversalErrors";

export module Move {

    type Request = {
        playerId: id | undefined,
        roomId: id | undefined,
        location: SphereXY | undefined
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {

        if (request.playerId === undefined || request.roomId === undefined || request.location === undefined) {
            client.sendError("game/location", UniversalErrors.BAD_MESSAGE)
            return roomDB
        }

        const game = roomDB.tryGetGame(request.roomId)

        if (!game) {
            client.sendError("game/location", UniversalErrors.ROOM_NOT_FOUND)
            return roomDB
        }

        const player = game.tryGetPlayer(request.playerId)

        if (!player) {
            client.sendError("game/location", UniversalErrors.PLAYER_NOT_FOUND)
            return roomDB
        }

        const gameWithMovedPlayer = game.movePlayer(request.playerId, request.location)

        const pickupItems = gameWithMovedPlayer.findItemsInPickupRange(player)
        const message = pickupItems.map(it => ({
            id: request.playerId,
            type: it.type,
            states: it.stats
        }))
        client.send("me/items-in-range", message)

        return roomDB.updateGame(request.roomId, gameWithMovedPlayer)
    }

}
