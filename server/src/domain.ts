export type id = number

export type degree = number

export type errorCode = number

export type Location = {
    lat: degree
    lng: degree
}

export type Stats = {
    range: number,
}

export enum PartType {
    Arms,
    Legs,
    Body,
    Head
}

export type Item = {
    location: Location,
    stats: Stats,
    type: PartType
}
