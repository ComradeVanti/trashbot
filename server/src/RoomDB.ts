import Immutable from "immutable";
import {SphereXY, id} from "./domain";
import {Lobby} from "./Lobby";
import {Game} from "./Game";

type LobbyMap = Immutable.Map<id, Lobby>
type GameMap = Immutable.Map<id, Game>

export class RoomDB {

    private static MIN_ROOM_ID: id = 10000
    private static MAX_ROOM_ID: id = 99999
    private static ID_DIFF = RoomDB.MAX_ROOM_ID - RoomDB.MIN_ROOM_ID

    static EMPTY = new RoomDB(Immutable.Map(), Immutable.Map())

    private static generateId(): id {
        return Math.floor(Math.random() * RoomDB.ID_DIFF) + RoomDB.MIN_ROOM_ID
    }

    constructor(
        private readonly lobbies: LobbyMap,
        private readonly games: GameMap) {
    }

    private hasLobbyWith(id: id) {
        return this.lobbies.has(id)
    }

    private generateFreeId(): id {
        let id = 0
        do {
            id = RoomDB.generateId()
        } while (this.hasLobbyWith(id))
        return id
    }

    addLobby(lobby: Lobby): [RoomDB, id] {
        const id = this.generateFreeId()
        return [new RoomDB(this.lobbies.set(id, lobby), this.games), id]
    }

    tryGetLobby(id: id): Lobby | null {
        return this.lobbies.get(id) ?? null
    }

    tryGetGame(id: id): Game | null {
        return this.games.get(id) ?? null
    }

    updateLobby(id: id, lobby: Lobby): RoomDB {
        return new RoomDB(this.lobbies.set(id, lobby), this.games)
    }

    updateGame(id: id, game: Game): RoomDB {
        return new RoomDB(this.lobbies, this.games.set(id, game))
    }

    startGameIn(id: id, hostLocation: SphereXY): RoomDB {
        const lobby = this.tryGetLobby(id)
        if (lobby) {
            return new RoomDB(
                this.lobbies.remove(id),
                this.games.set(id, Game.fromLobby(lobby, hostLocation, 500))
            )
        } else
            return this
    }

}
