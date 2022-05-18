import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {Location, playerId} from "../domain";
import {UniversalErrors} from "./UniversalErrors";
import {Game} from "../Game";

export module GetActors {

    enum Errors {
        BAD_NAME = 10
    }

    type Request = {
        playerId: number | undefined,
        roomId: number | undefined
    }

    type Response = {
        players: { playerId: playerId, location: Location }[],
        items: { location: Location }[]
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

        const players = game.findPlayersInViewOf(player)
            .remove(request.playerId)
            .map((data, id) => ({playerId: id, location: data.location}))
            .toList()
            .toArray()

        const response: Response = {
            players,
            items: []
        }
        client.send("me/actors", response)
        return roomDB
    }

}
