/// <reference path="../../typings/d3/d3.d.ts"/>

module semio.math {
    export class Extent {
        static widen(extent: [number, number], times: number): [number, number] {
            let a = extent[0];
            let b = extent[1];
            let range = b - a;
            let delta = range * times / 2; 
            return [a - delta, b + delta]
        }
    }
}