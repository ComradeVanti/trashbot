import Immutable from "immutable";
import {Entity, id, Item} from "./domain";

export class ItemDB {

    private static MIN_ITEM_ID: id = 0
    private static MAX_ITEM_ID: id = 100
    private static ID_DIFF = this.MAX_ITEM_ID - this.MIN_ITEM_ID

    private static generateId(): id {
        return Math.floor(Math.random() * this.ID_DIFF) + this.MIN_ITEM_ID
    }

    static fromItems(items: Item[]) {
        let db = new ItemDB(Immutable.Map())

        items.forEach(it => db = db.add(it)[0])

        return db
    }

    constructor(
        private readonly items: Immutable.Map<id, Item>) {
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
        return [new ItemDB(this.items.set(id, item)), id]
    }

    tryGetItem(id: id): Item | null {
        return this.items.get(id) ?? null
    }

    getItems(): Entity<Item>[] {
        return this.items.map((item, id) => ({...item, id}))
            .toList()
            .toArray()
    }

}
