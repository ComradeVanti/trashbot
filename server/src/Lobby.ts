import Immutable from "immutable";
import {id} from "./domain";
import {PlayersInLobby} from "./sockets/PlayersInLobby";

type LobbyPlayerData = {
    readonly name: string
}

type PlayerDataMap = Immutable.Map<id, LobbyPlayerData>

export class Lobby {

    private static MIN_PLAYER_ID: id = 0
    private static MAX_PLAYER_ID: id = 1000
    private static ID_DIFF = Lobby.MAX_PLAYER_ID - Lobby.MIN_PLAYER_ID

    static generateId(): id {
        return Math.floor(Math.random() * Lobby.ID_DIFF) + Lobby.MIN_PLAYER_ID
    }

    static newWithHost(name: string): [Lobby, id] {
        const playerData = {name}
        const playerId = this.generateId()
        return [
            new Lobby(Immutable.Map([[playerId, playerData]])),
            playerId]
    }


    readonly players: PlayerDataMap

    constructor(playerData: PlayerDataMap) {
        this.players = playerData
    }

    private hasPlayerWith(id: id): boolean {
        return this.players.has(id)
    }

    private generateFreeId(): id {
        let id = 0
        do {
            id = Lobby.generateId()
        } while (this.hasPlayerWith(id))
        return id
    }

    addPlayer(name: string): [Lobby, id] {
        const playerData = {name}
        const playerId = this.generateFreeId()
        return [
            new Lobby(this.players.set(playerId, playerData)),
            playerId]
    }

    getPlayers() {
        return Array.from(this.players.entries())
            .map(([id, data]) => ({id, name: data.name}))
    }
}
