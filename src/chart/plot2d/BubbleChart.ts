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
            return _.filter([this._colorColumn], _.negate(_.isNil));
        }

        public getNumericColumns(): Array<string> {
            return _.filter([this._xColumn, this._yColumn, this._areaColumn], _.negate(_.isNil));
        }

        public plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data) {
                return;
            }

            let xScale = context.getXScale(this._xColumn);
            let yScale = context.getYScale(this._yColumn);

            let xAccessor = (d: any) => +d[this._xColumn];
            let yAccessor = (d: any) => +d[this._yColumn];

            let bubbles = surface.svg.selectAll(".bubble")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "bubble")
                .attr("cx", (d) => xScale(xAccessor(d)))
                .attr("cy", (d) => yScale(yAccessor(d)));

            if (this._colorColumn) {
                let color = context.getCategoryColours(this._colorColumn);
                bubbles.attr("fill", (d) => color(d[this._colorColumn]));
            }

            if (this._areaColumn) {
                let areaColumnExtent = context.getOrCalculateNumericRange(data, this._areaColumn);
                let areaScale = d3.scale.linear().domain([0, areaColumnExtent[1]]).range([0, this._radius * this._radius]);
                bubbles.attr("r", (d) => Math.sqrt(areaScale(d[this._areaColumn])));
            } else {
                bubbles.attr("r", this._radius);
            }

            let tooltipColumns = [this._xColumn, this._yColumn, this._colorColumn, this._areaColumn];
            tooltipColumns = _.filter(tooltipColumns, _.negate(_.isNil));

            context.getSlicedColumns().forEach((column) => {
                tooltipColumns.push(column);
            });
            context.getTooltip().addOn(bubbles, (d) => {
                return tooltipColumns.map((col) => col + ": " + d[col]).join("<br/>");
            });
        }
    }
}
