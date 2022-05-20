export type id = number

export type degree = number

export type errorCode = number

export const GAME_TIME_MINUTES = 10
export const GAME_RADIUS = 150
export const PICKUP_RANGE = 40;

export type SphereXY = {
    lat: degree
    lng: degree
}

export type Stats = {
    range: number,
    coolness: number
}

export type Robot = {
    head: Stats,
    body: Stats,
    arms: Stats,
    legs: Stats
}

export type Entity<T> = T & { id: id }

export enum PartType {
    Arms,
    Legs,
    Body,
    Head
}

export type Item = {
    location: SphereXY,
    stats: Stats,
    type: PartType
}

