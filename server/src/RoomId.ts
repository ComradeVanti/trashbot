import {roomId} from "./domain";

export const MIN: roomId = 10000
export const MAX: roomId = 99999

const DIFF = MAX - MIN

export function generate() : roomId {
    return Math.floor(Math.random() * DIFF) + MIN
}
