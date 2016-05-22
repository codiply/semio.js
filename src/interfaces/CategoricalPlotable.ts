/// <reference path="./Context.ts"/>
/// <reference path="./Plotable.ts"/>
/// <reference path="./Surface.ts"/>

module semio.interfaces {
    export interface CategoricalPlotable extends Plotable {
        value(column: string): CategoricalPlotable;
        splitOn(column: string): CategoricalPlotable;
        getLegendColumn(): string;
    }
}