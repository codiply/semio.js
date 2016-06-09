/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../core/ColorPalette.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Margin.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.chart {
    import ColorPalette = semio.core.ColorPalette;
    import Context = semio.interfaces.Context;
    import Margin = semio.interfaces.Margin;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;

    export class HeatMap implements Plotable {
        private _xColumn: string;
        private _yColumn: string;
        private _sizeColumn: string;
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

        public sizeColumn(column: string): HeatMap {
            this._sizeColumn = column;
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
            return _.filter([this._sizeColumn, this._colorColumn], _.negate(_.isNull));
        }

        public plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data) {
                return;
            }

            let margin = surface.marginFromRatio(this._marginRatio);
            let width = surface.getWidth() - margin.left - margin.right;
            let height = surface.getHeight() - margin.top - margin.bottom;

            let xNames = _.chain(data).map((d) => d[this._xColumn]).uniq().value();
            let yNames = _.chain(data).map((d) => d[this._yColumn]).uniq().value();

            let xScale = d3.scale.ordinal().rangeBands([0, width]).domain(xNames);
            let yScale = d3.scale.ordinal().rangeBands([0, height]).domain(yNames);

            let xAxis = d3.svg.axis().orient("top").scale(xScale);
            let yAxis = d3.svg.axis().orient("left").scale(yScale);

            let plotableArea = surface.svg
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            let xAxisGroup = plotableArea.append("g")
                .attr("class", "x axis")
                .call(xAxis);
            xAxisGroup.selectAll("text")
                    .attr("y", -10)
                    .attr("dy", ".5em")
                    .attr("x", 0)
                    .attr("transform", "rotate(-45)")
                    .style("text-anchor", "start")
                    .style("font-weight", "bold");
            this.styleAxis(xAxisGroup);

            let yAxisGroup = plotableArea.append("g")
                .attr("class", "y axis")
                .call(yAxis);
            yAxisGroup.selectAll("text")
                    .style("text-anchor", "end");
            this.styleAxis(yAxisGroup);

            let tileWidth = width / xNames.length;
            let tileHeight = height / yNames.length;

            let colorColumnExtent = context.getOrCalculateNumericRange(data, this._colorColumn);
            let color = ColorPalette.sequential(colorColumnExtent);
            let tiles: d3.Selection<any>;

            if (this._sizeColumn) {
                let maxRadius = d3.min([tileWidth, tileHeight]) / 2;

                let sizeColumnExtent = context.getOrCalculateNumericRange(data, this._sizeColumn);
                let radiusScale = d3.scale.linear().domain(sizeColumnExtent).range([0, maxRadius]);

                tiles = plotableArea.selectAll(".tile")
                    .data(data)
                    .enter().append("circle")
                        .attr("class", "tile")
                        .attr("cx", (d) => tileWidth / 2 + xScale(d[this._xColumn]))
                        .attr("cy", (d) => tileHeight / 2 + yScale(d[this._yColumn]))
                        .attr("r", (d) => radiusScale(d[this._sizeColumn]))
                        .style("fill", (d) => color(d[this._colorColumn]));
            } else {
                tiles = plotableArea.selectAll(".tile")
                    .data(data)
                    .enter().append("rect")
                        .attr("class", "tile")
                        .attr("x", (d) => xScale(d[this._xColumn]))
                        .attr("y", (d) => yScale(d[this._yColumn]))
                        .attr("width", tileWidth)
                        .attr("height", tileHeight)
                        .style("fill", (d) => color(d[this._colorColumn]));
            }

           let tooltipColumns = [this._yColumn, this._xColumn, this._colorColumn, this._sizeColumn];
           tooltipColumns = _.filter(tooltipColumns, _.negate(_.isNull));

           context.getTooltip().addOn(tiles, (d) => {
                return tooltipColumns.map((col) => col + ": " + d[col]).join("<br/>");
            });
        }

        private styleAxis(axisGroup: d3.Selection<any>) {
            axisGroup.selectAll(".axis path")
                .style({
                    "fill": "none",
                    "stroke": "none"
                });
        }
    }
}
