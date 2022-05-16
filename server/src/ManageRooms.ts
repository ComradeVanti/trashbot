import {Player, Room, RoomDB, roomId} from "./domain";
import {Map} from "immutable"

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

export function openNewFor(host: Player, roomDB: RoomDB): [Room, RoomDB] {
    const roomId = generateFreeIdFor(roomDB)
    const room = {id: roomId, players: [host]}
    return [room, roomDB.set(roomId, room)]
}
