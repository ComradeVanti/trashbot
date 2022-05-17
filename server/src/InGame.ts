import {Room} from "./Room";
import {Location, playerId} from "./domain";
import Immutable from "immutable";

type InGamePlayerData = {
    readonly name: string,
    readonly  location: Location
}

type PlayerDataMap = Immutable.Map<playerId, InGamePlayerData>


export class InGame extends Room {

    readonly playerData: PlayerDataMap

    constructor(playerIds: Immutable.List<playerId>, playerData: PlayerDataMap) {
        super(playerIds)
        this.playerData = playerData
    }

}
