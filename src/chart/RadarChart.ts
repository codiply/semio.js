/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

namespace semio.chart {
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;

    export class RadarChart implements Plotable {
        private _dimensionColumns: Array<string>;
        private _pointRadius = 4;

        private _radarRadius: number;
        private _centerX: number;
        private _centerY: number;

        private _dimensionAngle: { [col: string]: number };

        private _dimensionXScale: { [col: string]: (value: number) => number } = {};
        private _dimensionYScale: { [col: string]: (value: number) => number } = {};

        public dimensionColumns(columns: Array<string>): RadarChart {
            this._dimensionColumns = columns;
            this._dimensionAngle = { };
            columns.forEach((col, i) => {
                this._dimensionAngle[col] = 2 *  Math.PI * i / this._dimensionColumns.length;
            });
            return this;
        }

        public pointRadius(r: number): RadarChart {
            this._pointRadius = r;
            return this;
        }

        public getCategoricalColumns(): Array<string> {
            return [];
        }

        public getNumericColumns(): Array<string> {
            return this._dimensionColumns;
        }

        public plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data) {
                return;
            }

            let width = surface.getWidth();
            let height = surface.getHeight();

            this._radarRadius = Math.min(width / 2, height / 2);
            this._centerX = width / 2;
            this._centerY = height / 2;

            let svg = surface.svg;

            let axes = svg.selectAll(".axis")
                .data(this._dimensionColumns)
                .enter()
                .append("g")
                .attr("class", "axis");

            axes.append("line")
                .attr("x1", this._centerX)
                .attr("y1", this._centerY)
                .attr("x2", (d) => this._centerX + this._radarRadius * Math.sin(this._dimensionAngle[d]))
                .attr("y2", (d) => this._centerY + this._radarRadius * Math.cos(this._dimensionAngle[d]))
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-width", "1px");

            this._dimensionColumns.forEach((col) => {
                this.setupScaleForColumn(col, data, context);
            });

            let pointsGroup = svg.append("g");

            data.forEach((d, i) => {
                let values = pointsGroup.selectAll(".values-" + i)
                    .data(this._dimensionColumns)
                    .enter()
                    .append("g")
                    .attr("class", "values-" + i);
                values.append("circle")
                    .attr("r", this._pointRadius)
                    .attr("cx", (col) => this._dimensionXScale[col](+d[col]))
                    .attr("cy", (col) => this._dimensionYScale[col](+d[col]))
                    .attr("fill", "blue");
            });
        }

        private setupScaleForColumn(column: string, data: Array<any>, context: Context): void {
            let columnExtent = context.getOrCalculateNumericRange(data, column);

            let xScale = d3.scale.linear()
                .domain(columnExtent)
                .range([this._centerX, this._centerX + (this._radarRadius - this._pointRadius) * Math.sin(this._dimensionAngle[column])]);
            let yScale = d3.scale.linear()
                .domain(columnExtent)
                .range([this._centerY, this._centerY + (this._radarRadius - this._pointRadius) * Math.cos(this._dimensionAngle[column])]);

            this._dimensionXScale[column] = xScale;
            this._dimensionYScale[column] = yScale;
        }
    }
}
