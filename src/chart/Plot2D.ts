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

        private _plotables: Array<TwoDimensionalPlotable> = [];

        public xColumn(column: string): Plot2D {
            this._xColumn = column;
            return this;
        }

        public yColumn(column: string): Plot2D {
            this._yColumn = column;
            return this;
        }

        public add(plotable: TwoDimensionalPlotable): Plot2D {
            this._plotables.push(plotable);
            return this;
        }

        public getCategoricalColumns(): Array<string> {
            let columns = _.flatMap(this._plotables, (pl) => pl.getCategoricalColumns());
            return _.union(columns);
        }

        public getNumericColumns(): Array<string> {
            let columns1 = [this._xColumn, this._yColumn];
            let columns2 = _.flatMap(this._plotables, (pl) => pl.getNumericColumns());
            return _.union(columns1, columns2);
        }

        public plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data) {
                return;
            }

            let plotableWidth = surface.getWidth();
            let plotableHeight = surface.getHeight();

            let xColumnExtent = context.getOrCalculateNumericRange(data, this._xColumn);
            let yColumnExtent = context.getOrCalculateNumericRange(data, this._yColumn);

            let xPadding = d3.max(this._plotables.map((pl) => pl.getXPadding()));
            let yPadding = d3.max(this._plotables.map((pl) => pl.getYPadding()));

            let xScale = d3.scale.linear()
                    .domain(xColumnExtent)
                    .range([0 + xPadding, plotableWidth - xPadding]);
            let yScale = d3.scale.linear()
                    .domain(yColumnExtent)
                    .range([0 + yPadding, plotableHeight - yPadding]);

            let updatedContext = context.setXScale(this._xColumn, xScale)
                .setYScale(this._yColumn, yScale);

            this._plotables.forEach((pl) => {
                pl.xColumn(this._xColumn)
                    .yColumn(this._yColumn)
                    .plot(data, surface, updatedContext);
            });
        }
    }
}
