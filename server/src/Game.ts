import {Entity, GAME_RADIUS, id, Item, PartType, PICKUP_RANGE, Robot, SphereXY} from "./domain";
import Immutable from "immutable";
import {Lobby} from "./Lobby";
import {SphereMath} from "./SphereMath";
import {Items} from "./Items";
import {ItemDB} from "./ItemDB";
import {UniversalError} from "./sockets/UniversalError";
import {Result} from "./Result";


type Player = {
    readonly name: string,
    readonly location: SphereXY,
    readonly robot: Robot,
}

const baseRobot: Robot = {
    head: {range: 200, coolness: 0},
    body: {range: 0, coolness: 0},
    arms: {range: 0, coolness: 0},
    legs: {range: 0, coolness: 0},
}

export class Game {

    static fromLobby(lobby: Lobby, hostLocation: SphereXY): Game {

        const players: Immutable.Map<id, Player> = lobby.guests.map((it) => ({
            name: it.name,
            location: {lat: 0, lng: 0},
            robot: baseRobot
        }))

        const playerCount = players.count()

        let game = new Game(players, ItemDB.EMPTY, hostLocation)

        for (let i = 0; i < playerCount * 2; i++) {
            game = game.addItemOfType(PartType.Head)
            game = game.addItemOfType(PartType.Body)
            game = game.addItemOfType(PartType.Arms)
            game = game.addItemOfType(PartType.Legs)
        }

        return game
    }


    constructor(readonly players: Immutable.Map<id, Player>,
                readonly items: ItemDB,
                readonly center: SphereXY) {

    }

    private mapPlayers(mapF: (map: Immutable.Map<id, Player>) => Immutable.Map<id, Player>): Game {
        return new Game(mapF(this.players), this.items, this.center)
    }


    get playersWithId(): Entity<Player>[] {
        return this.players
            .map((player, id) => ({...player, id}))
            .toList()
            .toArray()
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

    private randomLocation() {
        return SphereMath.randomPointInCircle(this.center, GAME_RADIUS)
    }

    private makeItemOfType(type: PartType) {
        return Items.makeItemOfType(this.randomLocation(), type)
    }

    tryGetPlayer(id: id): Result<Player> {
        const player = this.players.get(id)
        return player ? Result.ok(player) : Result.fail(UniversalError.PLAYER_NOT_FOUND)
    }

    private findPlayersInCircle(point: SphereXY, radius: number) {
        return this.players.filter(it => SphereMath.distance(point, it.location) <= radius)
    }

    findPlayersInViewOf(player: Player): Entity<Player>[] {
        return this.findPlayersInCircle(player.location, player.robot.head.range)
            .map((player, id) => ({...player, id}))
            .toList()
            .toArray()
    }

    addItemOfType(type: PartType) {
        const item = this.makeItemOfType(type)
        return new Game(this.players, this.items.add(item)[0], this.center)
    }

    movePlayer(id: id, location: SphereXY) {
        return this.mapPlayer(id, it => ({name: it.name, location, robot: it.robot}))
    }

    findItemsInPickupRange(player: Player) {
        return this.items.getInCircle(player.location, PICKUP_RANGE)
    }

    tryMapPlayer(id: id, mapF: (player: Player) => Player): Result<Game> {
        return this.tryGetPlayer(id)
            .map(mapF)
            .map(player => this.mapPlayers(it => it.set(id, player)))
    }

    tryBindPlayer(id: id, mapF: (player: Player) => Result<Player>): Result<Game> {
        return this.tryGetPlayer(id)
            .bind(mapF)
            .map(player => this.mapPlayers(it => it.set(id, player)))
    }

    tryGetItem(id: id): Result<Item> {
        return this.items.tryGetItem(id)
    }

    tryDespawnItem(id: id): Result<Game> {
        return this.items.tryRemove(id)
            .map(items => new Game(this.players, items, this.center))
    }

}
