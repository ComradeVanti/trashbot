import Immutable from "immutable";
import {Entity, id} from "./domain";

export type Guest = {
    readonly name: string
}

export class Lobby {

    private static MIN_PLAYER_ID: id = 0
    private static MAX_PLAYER_ID: id = 1000
    private static ID_DIFF = Lobby.MAX_PLAYER_ID - Lobby.MIN_PLAYER_ID

    static generateId(): id {
        return Math.floor(Math.random() * Lobby.ID_DIFF) + Lobby.MIN_PLAYER_ID
    }

    static newWithHost(name: string): [Lobby, id] {
        const guest = {name}
        const id = this.generateId()
        return [
            new Lobby(Immutable.Map([[id, guest]])),
            id]
    }

    constructor(readonly guests: Immutable.Map<id, Guest>) {
    }

    private hasGuestWith(id: id): boolean {
        return this.guests.has(id)
    }

    private generateFreeId(): id {
        let id = 0
        do {
            id = Lobby.generateId()
        } while (this.hasGuestWith(id))
        return id
    }

    addGuest(guest: Guest): [Lobby, id] {
        const id = this.generateFreeId()
        return [
            new Lobby(this.guests.set(id, guest)),
            id]
    }

    get guestsWithId(): Entity<Guest>[] {
        return Array.from(this.guests.entries())
            .map(([id, data]) => ({id, name: data.name}))
    }
}
