/// <reference path="../../../typings/d3/d3.d.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>
/// <reference path="../../interfaces/Context.ts"/>
/// <reference path="../../interfaces/Surface.ts"/>
/// <reference path="../../interfaces/TwoDimensionalPlotable.ts"/>

module semio.chart.plot2d {
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;
    import TwoDimensionalPlotable = semio.interfaces.TwoDimensionalPlotable;

    export class BubbleChart implements TwoDimensionalPlotable {
        private _xColumn: string;
        private _yColumn: string;

        public xColumn(column: string): BubbleChart {
            return this;
        }

        public yColumn(column: string): BubbleChart {
            return this;
        }

        public getLegendColumn(): string {
            return null;
        }

        public getCategoricalColumns(): Array<string> {
            return [];
        }

        public getNumericColumns(): Array<string> {
            return [];
        }

        public plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data) {
                return;
            }
        }
    }
}
