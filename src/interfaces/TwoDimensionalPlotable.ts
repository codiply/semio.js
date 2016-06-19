/// <reference path="./Context.ts"/>
/// <reference path="./Plotable.ts"/>
/// <reference path="./Surface.ts"/>

module semio.interfaces {
    export interface TwoDimensionalPlotable extends Plotable {
        xColumn(column: string): TwoDimensionalPlotable;
        yColumn(column: string): TwoDimensionalPlotable;
        getLegendColumn(): string;
        getXPadding(): number;
        getYPadding(): number;
    }
}
