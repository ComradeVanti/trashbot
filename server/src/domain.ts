import Immutable from "immutable"

export type Unit = null

export type playerId = number

export type roomId = number

export type Player = {
    id: playerId,
    name: string
}

export enum RoomType {
    LOBBY,
    SETUP,
    GAME
}

export interface Lobby {
    readonly type: RoomType.LOBBY
    readonly players: Immutable.List<Player>
}

export type Room = Lobby

export type RoomDB = Immutable.Map<roomId, Room>
