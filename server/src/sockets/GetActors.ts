import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {Location, playerId} from "../domain";

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
        const response: Response = {
            players: [
                {
                    playerId: 123,
                    location: {lat: 48.211992021759514, lng: 15.62987263544636}
                },
                {
                    playerId: 456,
                    location: {lat: 48.21358705490682, lng: 15.631356595173013}
                }
            ], items: []
        }
        client.send("me/actors", response)
        return roomDB
    }

}
