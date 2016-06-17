/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>
/// <reference path="../interfaces/TwoDimensionalPlotable.ts"/>

namespace semio.chart {
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    import TwoDimensionalPlotable = semio.interfaces.TwoDimensionalPlotable;

    export class Plot2D implements Plotable {
        private _xColumn: string;
        private _yColumn: string;
        private _colorColumn: string;

        private _plotables: Array<TwoDimensionalPlotable> = [];

        public xColumn(column: string): Plot2D {
            this._xColumn = column;
            return this;
        }

        public yColumn(column: string): Plot2D {
            this._yColumn = column;
            return this;
        }

        public color(column: string): Plot2D {
            this._colorColumn = column;
            return this;
        }

        public add(plotable: TwoDimensionalPlotable): Plot2D {
            this._plotables.push(plotable);
            return this;
        }

        public getCategoricalColumns(): Array<string> {
            if (this._colorColumn) {
                return [this._colorColumn];
            }
            return [];
        }

        public getNumericColumns(): Array<string> {
            return [this._xColumn, this._yColumn];
        }

        public plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data) {
                return;
            }
        }
    }
}
