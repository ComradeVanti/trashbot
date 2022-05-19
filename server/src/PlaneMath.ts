import {SphereXY} from "./domain";

export module PlaneMath {

    function deltaBetween(l1: SphereXY, l2: SphereXY): { lat: number, lng: number } {
        return {lat: l2.lat - l1.lat, lng: l2.lng - l1.lng}
    }

    export function distance(l1: SphereXY, l2: SphereXY): number {
        const delta = deltaBetween(l1, l2)
        return Math.sqrt(delta.lat * delta.lat + delta.lng * delta.lng)
    }

    export function randomPointInCircle(center: SphereXY, radius: number): SphereXY {
        const r = radius * Math.sqrt(Math.random())
        const theta = Math.random() * 2 * Math.PI

        return {
            lat: center.lat + r * Math.cos(theta),
            lng: center.lng + r * Math.sin(theta)
        }
    }

}
