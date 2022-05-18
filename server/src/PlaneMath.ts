import {Location} from "./domain";

export module PlaneMath {

    function deltaBetween(l1: Location, l2: Location): { lat: number, lng: number } {
        return {lat: l2.lat - l1.lat, lng: l2.lng - l1.lng}
    }

    export function distance(l1: Location, l2: Location): number {
        const delta = deltaBetween(l1, l2)
        return Math.sqrt(delta.lat * delta.lat + delta.lng * delta.lng)
    }

    export function randomPointInCircle(center: Location, radius: number): Location {
        const r = radius * Math.sqrt(Math.random())
        const theta = Math.random() * 2 * Math.PI

        return {
            lat: center.lat + r * Math.cos(theta),
            lng: center.lng + r * Math.sin(theta)
        }
    }

}
