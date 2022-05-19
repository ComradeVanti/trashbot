import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {UniversalError} from "./UniversalError";
import {Item, PartType, Robot} from "../domain";

export module GetRobot {

    type Request = {
        playerId: number,
        roomId: number
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {
        if (request.playerId === undefined || request.roomId === undefined) {
            client.sendError("game/pick-up-item", UniversalError.BAD_MESSAGE)
            return roomDB
        }

        roomDB.tryGetGame(request.roomId)
            .bind(game => game.tryGetPlayer(request.playerId))
            .map(player => player.robot)
            .match(robot => client.send("me/robot", {robot}),
                error => client.sendError("game/robot", error))

        return roomDB
    }

}
