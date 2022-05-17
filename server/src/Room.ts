import {playerId} from "./domain";
import Immutable from "immutable";

export abstract class Room {

    private static MIN_PLAYER_ID: playerId = 0
    private static MAX_PLAYER_ID: playerId = 1000
    private static ID_DIFF = Room.MIN_PLAYER_ID - Room.MAX_PLAYER_ID

    static generateId(): playerId {
        return Math.floor(Math.random() * Room.ID_DIFF) + Room.MIN_PLAYER_ID
    }

    readonly playerIds: Immutable.List<playerId>

    protected constructor(playerIds: Immutable.List<number>) {
        this.playerIds = playerIds
    }

    hasPlayerWith(id: playerId) {
        return this.playerIds.has(id)
    }

    generateFreeId(): playerId {
        let id = 0
        do {
            id = Room.generateId()
        } while (this.hasPlayerWith(id))
        return id
    }

}
