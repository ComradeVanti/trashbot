export type id = number

export type degree = number

export type errorCode = number

export type SphereXY = {
    lat: degree
    lng: degree
}

export type Stats = {
    range: number,
    coolness: number
}

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
