import {Room} from "./Room";
import Immutable from "immutable";
import {playerId, roomId} from "./domain";

export class LobbyPlayerData {
    readonly name: string

    constructor(name: string) {
        this.name = name
    }

}

type PlayerDataMap = Immutable.Map<playerId, LobbyPlayerData>

export class Lobby extends Room {

    static newWithHost(name: string): [Lobby, playerId] {
        const playerData = {name}
        const playerId = this.generateId()
        return [new Lobby(
            Immutable.List.of(playerId),
            Immutable.Map([[playerId, playerData]])),
            playerId]
    }


    readonly playerData: PlayerDataMap

    constructor(playerIds: Immutable.List<playerId>, playerData: PlayerDataMap) {
        super(playerIds)
        this.playerData = playerData
    }

}
