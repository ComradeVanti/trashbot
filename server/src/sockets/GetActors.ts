import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {Lobby} from "../Lobby";
import {Location, playerId} from "../domain";

export module GetActors {

    enum Errors {
        BAD_NAME = 10
    }

    type Request = {
        playerId: number,
        roomId: number
    }

    type Response = {
        players: { playerId: playerId, location: Location }[],
        items: { location: Location }[]
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {
        const response: Response = {
            players: [
                {
                    playerId: 123,
                    location: {lat: 10, lng: 5}
                },
                {
                    playerId: 456,
                    location: {lat: 11, lng: 6}
                }
            ], items: []
        }
        client.send("me/actors", response)
        return roomDB
    }

}
