import {RoomDB} from "../RoomDB";
import {SocketClient} from "./SocketClient";
import {UniversalError} from "./UniversalError";
import {Item, PartType, Robot} from "../domain";

export module PickUp {

    enum Errors {
        ITEM_OUT_OF_RANGE = 10
    }

    type Request = {
        playerId: number,
        roomId: number,
        itemId: number
    }

    function addPart(robot: Robot, item: Item): Robot {
        return {
            head: item.type === PartType.Head ? item.stats : robot.head,
            body: item.type === PartType.Body ? item.stats : robot.body,
            arms: item.type === PartType.Arms ? item.stats : robot.arms,
            legs: item.type === PartType.Legs ? item.stats : robot.legs,
        }
    }

    export function handle(request: Request, roomDB: RoomDB, client: SocketClient): RoomDB {
        if (request.playerId === undefined || request.roomId === undefined || request.itemId === undefined) {
            client.sendError("game/pick-up-item", UniversalError.BAD_MESSAGE)
            return roomDB
        }

        return roomDB.tryBindGame(request.roomId,
            game => game.tryBindPlayer(request.playerId,
                player => game.tryGetItem(request.itemId).map(
                    item => ({name: player.name, location: player.location, robot: addPart(player.robot, item)})
                ))
                .bind(game => game.tryGetItem(request.itemId).map(
                    item => game.addItemOfType(item.type)
                ))
                .bind(game => game.tryDespawnItem(request.itemId)))
            .handleError(error => client.sendError("game/pick-up-item", error), roomDB)
    }

}
