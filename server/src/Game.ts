import {Location, playerId, Stats} from "./domain";
import Immutable from "immutable";
import {Lobby} from "./Lobby";

type InGamePlayerData = {
    readonly name: string,
    readonly location: Location,
    readonly stats: Stats
}

type PlayerDataMap = Immutable.Map<playerId, InGamePlayerData>

export class Game {

    static fromLobby(lobby: Lobby): Game {
        const players = lobby.players.map((it) => ({
            name: it.name,
            location: { lat: 0, lng: 0},
            stats: { range: 1000 }
        }))
        return new Game(players)
    }

    readonly players: PlayerDataMap

    constructor(playerData: PlayerDataMap) {
        this.players = playerData
    }

    private mapData(mapF: (map: PlayerDataMap) => PlayerDataMap): Game {
        return new Game(mapF(this.players))
    }

    private mapPlayerData(id: playerId, mapF: (data: InGamePlayerData) => InGamePlayerData) {
        return this.mapData(it => {
            const data = it.get(id)

            if (data !== undefined) {
                const mapped = mapF(data)
                return it.set(id, mapped);
            }
            return it
        })
    }

    movePlayer(id: playerId, location: Location) {
        return this.mapPlayerData(id, it => ({name: it.name, location, stats: it.stats}))
    }

}
