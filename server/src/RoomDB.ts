import Immutable from "immutable";
import {roomId} from "./domain";
import {Room} from "./Room";
import {Lobby} from "./Lobby";

type RoomMap = Immutable.Map<roomId, Room>

export class RoomDB {

    private static MIN_ROOM_ID: roomId = 10000
    private static MAX_ROOM_ID: roomId = 99999
    private static ID_DIFF = RoomDB.MAX_ROOM_ID - RoomDB.MIN_ROOM_ID

    static EMPTY = new RoomDB(Immutable.Map())

    private static generateId(): roomId {
        return Math.floor(Math.random() * RoomDB.ID_DIFF) + RoomDB.MIN_ROOM_ID
    }

    private readonly rooms: RoomMap


    constructor(rooms: RoomMap) {
        this.rooms = rooms
    }


    hasRoomWith(id: roomId) {
        return this.rooms.has(id)
    }

    private generateFreeId(): roomId {
        let id = 0
        do {
            id = RoomDB.generateId()
        } while (this.hasRoomWith(id))
        return id
    }

    add(room: Room): [RoomDB, roomId] {
        const id = this.generateFreeId()
        return [new RoomDB(this.rooms.set(id, room)), id]
    }

    tryGetRoom(id: roomId): Room | null {
        return this.rooms.get(id) ?? null
    }

    updateRoom(id: roomId, room: Room): RoomDB {
        return new RoomDB(this.rooms.set(id, room))
    }

}
