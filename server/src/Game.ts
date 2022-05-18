import {Item, Location, PartType, playerId, Stats} from "./domain";
import Immutable from "immutable";
import {Lobby} from "./Lobby";
import {PlaneMath} from "./PlaneMath";
import {Items} from "./Items";

type InGamePlayerData = {
    readonly name: string,
    readonly location: Location,
    readonly stats: Stats
}

type PlayerDataMap = Immutable.Map<playerId, InGamePlayerData>

export class Game {

    static fromLobby(lobby: Lobby, hostLocation: Location, gameRadius: number): Game {

        const players = lobby.players.map((it) => ({
            name: it.name,
            location: {lat: 0, lng: 0},
            stats: {range: 1000}
        }))

        const playerCount = players.count()

        function randomLocation() {
            return PlaneMath.randomPointInCircle(hostLocation, gameRadius)
        }

        function makeItemsOfType(type: PartType, count: number) {
            return Array.from({length: count}, () => (Items.makeItemOfType(randomLocation(), type)))
        }

        function makeItems(): Item[] {
            return Array.prototype.concat.apply([], [
                makeItemsOfType(PartType.Arms, playerCount),
                makeItemsOfType(PartType.Head, playerCount)
            ])
        }


        return new Game(players, Immutable.List(makeItems()))
    }


    constructor(readonly players: PlayerDataMap,
                readonly items: Immutable.List<Item>) {

    }

    private mapPlayers(mapF: (map: PlayerDataMap) => PlayerDataMap): Game {
        return new Game(mapF(this.players), this.items)
    }

    private mapPlayer(id: playerId, mapF: (data: InGamePlayerData) => InGamePlayerData) {
        return this.mapPlayers(it => {
            const data = it.get(id)

            if (data !== undefined) {
                const mapped = mapF(data)
                return it.set(id, mapped);
            }
            return it
        })
    }

    tryGetPlayer(id: playerId): InGamePlayerData | null {
        return this.players.get(id) ?? null
    }

    findPlayersInCircle(point: Location, radius: number) {
        return this.players.filter(it => PlaneMath.distance(point, it.location) <= radius)
    }

    findPlayersInViewOf(player: InGamePlayerData) {
        return this.findPlayersInCircle(player.location, player.stats.range)
    }

    movePlayer(id: playerId, location: Location) {
        return this.mapPlayer(id, it => ({name: it.name, location, stats: it.stats}))
    }

}
