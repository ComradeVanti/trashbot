import {Location, playerId, roomId} from "./domain"

// HOST

export type HostMsg = {
    playerName: string
}

export type HostResponse = {
    playerId: playerId
    roomId: roomId
}

// JOIN

export type JoinMsg = {
    playerName: string
}


// GET-ACTORS

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
