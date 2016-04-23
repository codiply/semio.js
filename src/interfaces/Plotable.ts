/// <reference path="../../typings/d3/d3.d.ts"/>

module semio.interfaces {
    export interface Plotable {
        plot(svg: d3.Selection<any>, data: Array<any>): void;
    }
}