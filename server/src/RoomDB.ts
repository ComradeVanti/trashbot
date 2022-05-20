import Immutable from "immutable";
import {id, SphereXY} from "./domain";
import {Lobby} from "./Lobby";
import {Game} from "./Game";
import {UniversalError} from "./sockets/UniversalError";
import {Result} from "./Result";

type LobbyMap = Immutable.Map<id, Lobby>
type GameMap = Immutable.Map<id, Game>

export enum RoomDBError {
    GAME_NOT_FOUND
}


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

    tryGetGame(id: id): Result<Game> {
        const game = this.games.get(id)
        return game ? Result.ok(game) : Result.fail(UniversalError.ROOM_NOT_FOUND)
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
                this.games.set(id, Game.fromLobby(lobby, hostLocation))
            )
        } else
            return this
    }

    tryBindGame(id: id, mapF: (game: Game) => Result<Game>): Result<RoomDB> {
        return this.tryGetGame(id)
            .bind(mapF)
            .map(game => this.updateGame(id, game))
    }

}
