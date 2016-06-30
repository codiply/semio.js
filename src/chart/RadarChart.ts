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
        private _dimensionAngle: { [col: string]: number };

        public dimensionColumns(columns: Array<string>): RadarChart {
            this._dimensionColumns = columns;
            this._dimensionAngle = { };
            columns.forEach((col, i) => {
                this._dimensionAngle[col] = 2 *  Math.PI * i / this._dimensionColumns.length;
            });
            return this;
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

            let width = surface.getWidth();
            let height = surface.getHeight();
            let radius = Math.min(width / 2, height / 2);
            let centerX = width / 2;
            let centerY = height / 2;

            let svg = surface.svg;

            let axes = svg.selectAll(".axis")
                .data(this._dimensionColumns)
                .enter()
                .append("g")
                .attr("class", "axis");

            axes.append("line")
                .attr("x1", centerX)
                .attr("y1", centerY)
                .attr("x2", (d) => centerX + radius * Math.sin(this._dimensionAngle[d]))
                .attr("y2", (d) => centerY + radius * Math.cos(this._dimensionAngle[d]))
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-width", "1px");
        }
    }
}
