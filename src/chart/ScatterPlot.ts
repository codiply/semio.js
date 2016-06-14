/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

namespace semio.chart {
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;

    export class ScatterPlot implements Plotable {
        private _xColumn: string;
        private _yColumn: string;
        private _colorColumn: string;

        public xColumn(column: string): ScatterPlot {
            this._xColumn = column;
            return this;
        }
        
        public yColumn(column: string): ScatterPlot {
            this._yColumn = column;
            return this;
        }
        
        public color(column: string): ScatterPlot {
            this._colorColumn = column;
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
