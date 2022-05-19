import {SphereXY, id, GAME_TIME_MINUTES} from "../domain"
import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {UniversalError} from "./UniversalError";

export module Ready {

    type Request = {
        playerId: id | undefined,
        roomId: id | undefined,
        location: SphereXY | undefined
    }
    
    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {
        if (request.playerId === undefined || request.roomId === undefined || request.location === undefined) {
            client.sendError("lobby/ready", UniversalError.BAD_MESSAGE)
            return roomDB
        }

        const dbWithGame = roomDB.startGameIn(request.roomId, request.location)
        client.sendToRoom(request.roomId, "lobby/ready", {})
        client.send("game/start", { minutes: GAME_TIME_MINUTES })

        return dbWithGame
    }

}
