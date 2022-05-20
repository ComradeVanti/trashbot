import Immutable from "immutable";
import {Entity, id, Item, SphereXY} from "./domain";
import {SphereMath} from "./SphereMath";
import {UniversalError} from "./sockets/UniversalError";
import {Result} from "./Result";

export class ItemDB {

    private static MIN_ITEM_ID: id = 0
    private static MAX_ITEM_ID: id = 100
    private static ID_DIFF = this.MAX_ITEM_ID - this.MIN_ITEM_ID

    private static generateId(): id {
        return Math.floor(Math.random() * this.ID_DIFF) + this.MIN_ITEM_ID
    }

    static EMPTY = new ItemDB(Immutable.Map())


    constructor(
        private readonly items: Immutable.Map<id, Item>) {
    }


    private mapItems(mapF: (map: Immutable.Map<id, Item>) => Immutable.Map<id, Item>): ItemDB {
        return new ItemDB(mapF(this.items))
    }

    private hasItemWith(id: id) {
        return this.items.has(id)
    }

    private generateFreeId(): id {
        let id = 0
        do {
            id = ItemDB.generateId()
        } while (this.hasItemWith(id))
        return id
    }

    add(item: Item): [ItemDB, id] {
        const id = this.generateFreeId()
        return [this.mapItems(it => it.set(id, item)), id]
    }

    tryGetItem(id: id):Result<Item>{
        const item = this.items.get(id)
        return item ? Result.ok(item) : Result.fail(UniversalError.ITEM_NOT_FOUND)
    }

    get itemsWithId(): Entity<Item>[] {
        return this.items.map((item, id) => ({...item, id}))
            .toList()
            .toArray()
    }

    getInCircle(point: SphereXY, radius: number) {
        return this.itemsWithId.filter(it => SphereMath.distance(it.location, point) <= radius)
    }

    tryRemove(id: id): Result<ItemDB> {
        if (this.items.has(id)) return Result.ok(this.mapItems(it => it.remove(id)))
        return Result.fail(UniversalError.ITEM_NOT_FOUND)
    }

}
