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
        private _radius: number = 4;

        private _xAccessor: (d: any) => number;
        private _yAccessor: (d: any) => number;

        public xColumn(column: string): BubbleChart {
            this._xColumn = column;
            this._xAccessor = (d) => +d[column];
            return this;
        }

        public yColumn(column: string): BubbleChart {
            this._yColumn = column;
            this._yAccessor = (d) => +d[column];
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

        public radius(r: number): BubbleChart {
            this._radius = r;
            return this;
        }

        public getLegendColumn(): string {
            return this._colorColumn;
        }

        public getXPadding(): number {
            return this._radius;
        }

        public getYPadding(): number {
            return this._radius;
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

            let xScale = context.getXScale(this._xColumn);
            let yScale = context.getYScale(this._yColumn);

            let xAccessor = (d: any) => +d[this._xColumn];
            let yAccessor = (d: any) => +d[this._yColumn];

            surface.svg.selectAll(".bubble")
                .data(data)
                .enter().append("circle")
                .attr("class", "bubble")
                .attr("r", this._radius)
                .attr("cx", (d) => xScale(xAccessor(d)))
                .attr("cy", (d) => yScale(yAccessor(d)));
        }
    }
}
