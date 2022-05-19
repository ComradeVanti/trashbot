import {Item, SphereXY, PartType, id, Stats, Entity} from "./domain";
import Immutable from "immutable";
import {Lobby} from "./Lobby";
import {SphereMath} from "./SphereMath";
import {Items} from "./Items";
import {ItemDB} from "./ItemDB";

type Player = {
    readonly name: string,
    readonly location: SphereXY,
    readonly stats: Stats
}

export class Game {

    static fromLobby(lobby: Lobby, hostLocation: SphereXY, gameRadius: number): Game {

        const players = lobby.guests.map((it) => ({
            name: it.name,
            location: {lat: 0, lng: 0},
            stats: {range: 200, coolness: 0}
        }))

        const playerCount = players.count()

        function randomLocation() {
            return SphereMath.randomPointInCircle(hostLocation, gameRadius)
        }

        function makeItemsOfType(type: PartType, count: number) {
            return Array.from({length: count}, () => (Items.makeItemOfType(randomLocation(), type)))
        }

        function makeItems(): Item[] {
            return Array.prototype.concat.apply([], [
                makeItemsOfType(PartType.Arms, playerCount),
                makeItemsOfType(PartType.Body, playerCount),
                makeItemsOfType(PartType.Legs, playerCount),
                makeItemsOfType(PartType.Head, playerCount)
            ])
        }


        return new Game(players, ItemDB.fromItems(makeItems()))
    }


    constructor(readonly players: Immutable.Map<id, Player>,
                readonly items: ItemDB) {

    }

    private mapPlayers(mapF: (map: Immutable.Map<id, Player>) => Immutable.Map<id, Player>): Game {
        return new Game(mapF(this.players), this.items)
    }

    private mapPlayer(id: id, mapF: (data: Player) => Player) {
        return this.mapPlayers(it => {
            const data = it.get(id)

            if (data !== undefined) {
                const mapped = mapF(data)
                return it.set(id, mapped);
            }
            return it
        })
    }

    tryGetPlayer(id: id): Player | null {
        return this.players.get(id) ?? null
    }

    private findPlayersInCircle(point: SphereXY, radius: number) {
        return this.players.filter(it => SphereMath.distance(point, it.location) <= radius)
    }

    findPlayersInViewOf(player: Player): Entity<Player>[] {
        return this.findPlayersInCircle(player.location, player.stats.range)
            .map((player, id) => ({...player, id}))
            .toList()
            .toArray()
    }

    movePlayer(id: id, location: SphereXY) {
        return this.mapPlayer(id, it => ({name: it.name, location, stats: it.stats}))
    }

}
