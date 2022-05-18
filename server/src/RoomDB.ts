import Immutable from "immutable";
import {roomId} from "./domain";
import {Lobby} from "./Lobby";
import {InGame} from "./InGame";

type LobbyMap = Immutable.Map<roomId, Lobby>
type GameMap = Immutable.Map<roomId, InGame>

export class RoomDB {

    private static MIN_ROOM_ID: roomId = 10000
    private static MAX_ROOM_ID: roomId = 99999
    private static ID_DIFF = RoomDB.MAX_ROOM_ID - RoomDB.MIN_ROOM_ID

    static EMPTY = new RoomDB(Immutable.Map(), Immutable.Map())

    private static generateId(): roomId {
        return Math.floor(Math.random() * RoomDB.ID_DIFF) + RoomDB.MIN_ROOM_ID
    }

    constructor(
        private readonly lobbies: LobbyMap,
        private readonly games: GameMap) {
    }

    private hasLobbyWith(id: roomId) {
        return this.lobbies.has(id)
    }

    private generateFreeId(): roomId {
        let id = 0
        do {
            id = RoomDB.generateId()
        } while (this.hasLobbyWith(id))
        return id
    }

    addLobby(lobby: Lobby): [RoomDB, roomId] {
        const id = this.generateFreeId()
        return [new RoomDB(this.lobbies.set(id, lobby), this.games), id]
    }

    tryGetLobby(id: roomId): Lobby | null {
        return this.lobbies.get(id) ?? null
    }

    tryGetGame(id: roomId): InGame | null {
        return this.games.get(id) ?? null
    }

    updateLobby(id: roomId, lobby: Lobby): RoomDB {
        return new RoomDB(this.lobbies.set(id, lobby), this.games)
    }

    updateGame(id: roomId, game: InGame): RoomDB {
        return new RoomDB(this.lobbies, this.games.set(id, game))
    }

}
