import {SphereXY, id} from "../domain"
import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {UniversalError} from "./UniversalError";

export module Move {

    type Request = {
        playerId: id,
        roomId: id,
        location: SphereXY
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {

        if (request.playerId === undefined || request.roomId === undefined || request.location === undefined) {
            client.sendError("game/location", UniversalError.BAD_MESSAGE)
            return roomDB
        }

        return roomDB.tryBindGame(request.roomId,
            game => game.tryGetPlayer(request.playerId)
                .map(player => {
                    const gameWithMovedPlayer = game.movePlayer(request.playerId, request.location)

                    const message = gameWithMovedPlayer
                        .findItemsInPickupRange(player)
                        .map(it => ({
                            id: it.id,
                            type: it.type,
                            states: it.stats
                        }))
                    client.send("me/items-in-range", message)

                    return gameWithMovedPlayer
                })).handleError(error => client.sendError("game/location", error), roomDB)
    }

}
