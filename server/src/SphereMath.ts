import {SphereXY} from "./domain";

export module SphereMath {

    const GEOGRAPHIC_MILE = 1855.3248
    const M_PER_LAT_DEGREE = 111120
    const EARTH_RADIUS_M = 6371000

    function metersToLatDegrees(m: number) {
        return m / M_PER_LAT_DEGREE
    }

    function metersToLngDegreesAt(m: number, lat: number) {
        return ((m / GEOGRAPHIC_MILE) / 60 / Math.cos(lat))
    }

    function degreesToRadians(degrees: number) {
        return degrees * Math.PI / 180;
    }

    export function distance(l1: SphereXY, l2: SphereXY): number {
        const dLat = degreesToRadians(l2.lat - l1.lat);
        const dLon = degreesToRadians(l2.lng - l1.lng);

        const lat1 = degreesToRadians(l1.lat);
        const lat2 = degreesToRadians(l2.lat);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_M * c;
    }

    export function randomPointInCircle(center: SphereXY, radius: number): SphereXY {
        const r = radius * Math.sqrt(Math.random())
        const theta = Math.random() * 2 * Math.PI
        const meterOffset = {lat: r * Math.cos(theta), lng: r * Math.sin(theta)}
        const degreeOffset = {
            lat: metersToLatDegrees(meterOffset.lat),
            lng: metersToLngDegreesAt(meterOffset.lng, center.lat)
        }
        return {
            lat: center.lat + degreeOffset.lat,
            lng: center.lng + degreeOffset.lng
        }
    }

}
