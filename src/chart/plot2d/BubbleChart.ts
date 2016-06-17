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
        private _colorColumn: string;
        private _areaColumn: string;

        public xColumn(column: string): BubbleChart {
            return this;
        }

        public yColumn(column: string): BubbleChart {
            return this;
        }

        public colorColumn(column: string): BubbleChart {
            this._colorColumn = column;
            return this;
        }
        
        public areaColumn(column: string): BubbleChart {
            this._areaColumn = column;
            return this;
        }

        public getLegendColumn(): string {
            return this._colorColumn;
        }

        public getCategoricalColumns(): Array<string> {
            return _.filter([this._colorColumn], _.negate(_.isNull));
        }

        public getNumericColumns(): Array<string> {
            return _.filter([this._xColumn, this._yColumn, this._areaColumn], _.negate(_.isNull));
        }

        public plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data) {
                return;
            }
        }
    }
}
