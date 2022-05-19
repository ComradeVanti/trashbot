import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {Item, SphereXY, id} from "../domain";
import {UniversalErrors} from "./UniversalErrors";
import {Game} from "../Game";

export module GetActors {

    enum Errors {
        BAD_NAME = 10
    }

    type ThingAtPlace = { id: id, location: SphereXY }

    type Request = {
        playerId: number | undefined,
        roomId: number | undefined
    }

    type Response = {
        players: ThingAtPlace[],
        items: ThingAtPlace[]
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {

        if (request.playerId === undefined || request.roomId === undefined) {
            client.sendError("game/get-actors", UniversalErrors.BAD_MESSAGE)
            return roomDB;
        }

        const game = roomDB.tryGetGame(request.roomId)
        if (game === null) {
            client.sendError("game/get-actors", UniversalErrors.ROOM_NOT_FOUND)
            return roomDB;
        }

        const player = game.tryGetPlayer(request.playerId)
        if (player === null) {
            client.sendError("game/get-actors", UniversalErrors.PLAYER_NOT_FOUND)
            return roomDB;
        }

        const players: ThingAtPlace[] = game.findPlayersInViewOf(player)
            .filter(it => it.id !== request.playerId)
            .map(it => ({id: it.id, location: it.location}))

        const items: ThingAtPlace[] = game.items.getItems()
            .map(it => ({id: it.id, location: it.location}))

        const response: Response = {players, items}
        client.send("me/actors", response)
        return roomDB
    }

}
