/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Margin.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.chart {
    import Context = semio.interfaces.Context;
    import Margin = semio.interfaces.Margin;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;

    export class HeatMap implements Plotable {
        private _xColumn: string;
        private _yColumn: string;
        private _radiusColumn: string;
        private _colorColumn: string;

        private _marginRatio: Margin = {
            bottom: 0.02,
            left: 0.16,
            right: 0.02,
            top: 0.16
        };

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

        public marginRatio(marginRatio: Margin): HeatMap {
            this._marginRatio = marginRatio;
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

            let margin = surface.marginFromRatio(this._marginRatio);
            let width = surface.getWidth() - margin.left - margin.right;
            let height = surface.getWidth() - margin.top - margin.bottom;

            let xValues = d3.set(data.map((d) => d[this._xColumn]));
            let yValues = d3.set(data.map((d) => d[this._yColumn]));

            let xScale = d3.scale.ordinal().rangeBands([0, width]);
            let yScale = d3.scale.ordinal().rangeBands([0, height]);

            let xAxis = d3.svg.axis().orient("top");
            let yAxis = d3.svg.axis().orient("left");

            let plotableArea = surface.svg
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }
    }
}
