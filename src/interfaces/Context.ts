/// <reference path="./Tooltip.ts"/>

module semio.interfaces {
    export interface Context {
        setCategoryColours(column: string, colours: (value: string) => string): Context;
        setCategoryValues(column: string, values: Array<string>): Context;
        setNumericRange(column: string, range: [number, number]): Context;
        setSlicedColumnValue(column: string, value: string): Context;
        setXScale(column: string, scale: (value: d3.Primitive) => number): Context;
        setYScale(column: string, scale: (value: d3.Primitive) => number): Context;
        setTooltip(tooltip: Tooltip): Context;

        getCategoryColours(column: string): (value: string) => string;
        getCategoryValues(column: string): Array<string>;
        getNumericRange(column: string): [number, number];
        getSlicedColumns(): Array<string>;
        getSlicedColumnValue(column: string): string;
        getXScale(column: string): (value: d3.Primitive) => number;
        getYScale(column: string): (value: d3.Primitive) => number;
        getTooltip(): Tooltip;
    }
}
