import {playerId, roomId} from "./domain"

export type HostMsg = {
    playerName: string
}

export type HostResponse = {
    playerId: playerId
    roomId: roomId
}
