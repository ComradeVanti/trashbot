import {Item, Location, PartType, Stats} from "./domain";

export module Items {

    function makeStatsFor(partType: PartType): Stats {
        return {
            range: partType === PartType.Head ? Math.random() * 200 + 100 : 0
        }
    }

    export function makeItemOfType(location: Location, type: PartType): Item {
        return {
            id: 0,
            location,
            stats: makeStatsFor(type),
            type
        }
    }

}
