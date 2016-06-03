/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.chart {
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;

    export class HeatMap implements Plotable {
        private _xColumn: string;
        private _yColumn: string;
        private _radiusColumn: string;
        private _colorColumn: string;

        public xColumn(column: string): HeatMap {
            this._xColumn = column;
            return this;
        }

        public yColumn(column: string): HeatMap {
            this._yColumn = column;
            return this;
        }

        public radiusColumn(column: string): HeatMap {
            this._radiusColumn = column;
            return this;
        }

        public colorColumn(column: string): HeatMap {
            this._colorColumn = column;
            return this;
        }

        public getCategoricalColumns(): Array<string> {
            return _.filter([this._xColumn, this._yColumn], _.negate(_.isNull));
        }

        public getNumericColumns(): Array<string> {
            return _.filter([this._radiusColumn, this._colorColumn], _.negate(_.isNull));
        }

        public plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data) {
                return;
            }
        }
    }
}
