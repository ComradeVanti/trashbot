import {Item, SphereXY, PartType, Stats} from "./domain";

export module Items {

    function makeStatsFor(partType: PartType): Stats {
        return {
            range: partType === PartType.Head ? Math.random() * 200 + 100 : 0
        }
    }

    export function makeItemOfType(location: SphereXY, type: PartType): Item {
        return {
            location,
            stats: makeStatsFor(type),
            type
        }
    }

}
