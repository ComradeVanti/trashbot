import {Location, playerId, roomId} from "./domain"

export type HostMsg = {
    playerName: string
}

export type HostResponse = {
    playerId: playerId
    roomId: roomId
}

export type PlayerActorResponse = {
    type: 0,
    playerId: playerId,
    location: Location
}

export type ActorResponse = PlayerActorResponse

export type GetActorsMsg = {
    playerId: playerId,
    location: Location
}

export type GetActorsResponse = {
    actors: ActorResponse[]
}
