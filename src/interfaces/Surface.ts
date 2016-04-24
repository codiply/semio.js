/// <reference path="../../typings/d3/d3.d.ts"/>

module semio.interfaces {
    export interface Surface {
        svg: d3.Selection<any>;
        setWidth(width: number): Surface;
        setHeight(width: number): Surface;
        getWidth(): number;
        getHeight(): number;
        splitRows(n: number): Array<Surface>;
        splitColumns(n: number): Array<Surface>;
        splitGrid(n: number): Array<Surface>;
    }
}