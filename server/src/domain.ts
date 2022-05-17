import Immutable from "immutable"

export type Unit = null

export type playerId = number

export type roomId = number

export type Player = {
    id: playerId,
    name: string
}

export type Room = {
    id: roomId,
    players: Player[]
}

export type RoomDB = Immutable.Map<roomId, Room>
