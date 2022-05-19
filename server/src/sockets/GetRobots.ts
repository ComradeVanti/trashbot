import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {UniversalError} from "./UniversalError";
import {Item, PartType, Robot} from "../domain";

export module GetRobots {

    type Request = {
        roomId: number
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {
        if (request.roomId === undefined) {
            client.sendError("game/pick-up-item", UniversalError.BAD_MESSAGE)
            return roomDB
        }

        roomDB.tryGetGame(request.roomId)
            .map(game => game.playersWithId)
            .match(robots => client.send("game/robots", robots),
                error => client.sendError("game/robots", error))

        return roomDB
    }

}
