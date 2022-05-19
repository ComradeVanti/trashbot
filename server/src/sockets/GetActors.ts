import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {Item, SphereXY, id} from "../domain";
import {UniversalError} from "./UniversalError";
import {Game} from "../Game";
import {Result} from "../Result";

export module GetActors {

    enum Errors {
        BAD_NAME = 10
    }

    type ThingAtPlace = { id: id, location: SphereXY }

    type Request = {
        playerId: number,
        roomId: number
    }

    type Response = {
        players: ThingAtPlace[],
        items: ThingAtPlace[]
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {

        if (request.playerId === undefined || request.roomId === undefined) {
            client.sendError("game/get-actors", UniversalError.BAD_MESSAGE)
            return roomDB;
        }

        roomDB.tryGetGame(request.roomId)
            .bind(game => game.tryGetPlayer(request.playerId)
                .map(player => {
                    const players: ThingAtPlace[] = game.findPlayersInViewOf(player)
                        .filter(it => it.id !== request.playerId)
                        .map(it => ({id: it.id, location: it.location}))

                    const items: ThingAtPlace[] = game.items.itemsWithId
                        .map(it => ({id: it.id, location: it.location}))

                    const response: Response = {players, items}
                    return response
                }))
            .match(
                response => client.send("me/actors", response),
                error => client.sendError("game/get-actors", error)
            )

        return roomDB
    }

}
