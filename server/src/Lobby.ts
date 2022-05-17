import {Room} from "./Room";
import Immutable from "immutable";
import {playerId} from "./domain";

type LobbyPlayerData = {
    readonly name: string
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


    addPlayer(name: string) {
        const playerData = {name}
        const playerId = this.generateFreeId()
        return new Lobby(
            this.playerIds.push(playerId),
            this.playerData.set(playerId, playerData)
        )
    }
}
