import {Location} from "../domain";

export module PlaneMath {

    export function deltaBetween(l1: Location, l2: Location): { lat: number, lng: number } {
        return {lat: l2.lat - l1.lat, lng: l2.lng - l1.lng}
    }

    export function distance(l1: Location, l2: Location): number {

        const delta = deltaBetween(l1, l2)
        return Math.sqrt(delta.lat * delta.lat + delta.lng * delta.lng)

    }

}
