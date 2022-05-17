import {Lobby, Player, Room, RoomDB, roomId, RoomType} from "./domain";
import Immutable, {Map, List} from "immutable"

const MIN_ID: roomId = 10000
const MAX_ID: roomId = 99999
const ID_DIFF = MAX_ID - MIN_ID

function generateId(): roomId {
    return Math.floor(Math.random() * ID_DIFF) + MIN_ID
}

function generateFreeIdFor(roomDB: RoomDB): roomId {
    let id = 0
    do {
        id = generateId()
    } while (roomDB.has(id))
    return id
}

export const EMPTY_DB = Map<roomId, Room>()

function lobby(players: Immutable.List<Player>): Room {
    return {type: RoomType.LOBBY, players}
}

export function openNewFor(host: Player, roomDB: RoomDB): [RoomDB, roomId] {
    const roomId = generateFreeIdFor(roomDB)
    const room = lobby(List.of(host))
    return [roomDB.set(roomId, room), roomId]
}
