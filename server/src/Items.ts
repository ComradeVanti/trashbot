import {Item, SphereXY, PartType, Stats} from "./domain";

export module Items {

    function randBetween(min: number, max: number) {
        const diff = max - min
        return Math.random() * diff + min
    }

    function makeStatsFor(partType: PartType): Stats {
        return {
            range: partType === PartType.Head ? randBetween(50, 200) : 0,
            coolness: randBetween(0, 100)
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
