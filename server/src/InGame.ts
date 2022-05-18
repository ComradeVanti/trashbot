import {Room} from "./Room";
import {Location, playerId} from "./domain";
import Immutable from "immutable";

type InGamePlayerData = {
    readonly name: string,
    readonly location: Location
}

type PlayerDataMap = Immutable.Map<playerId, InGamePlayerData>

export class InGame extends Room {

    readonly playerData: PlayerDataMap

    constructor(playerIds: Immutable.List<playerId>, playerData: PlayerDataMap) {
        super(playerIds)
        this.playerData = playerData
    }

    private mapData(mapF: (map: PlayerDataMap) => PlayerDataMap): InGame {
        return new InGame(this.playerIds, mapF(this.playerData))
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
        return this.mapPlayerData(id, it => ({name: it.name, location}))
    }

}
