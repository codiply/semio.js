/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../core/ColorPalette.ts"/>
/// <reference path="../interfaces/CategoricalPlotable.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Margin.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>
/// <reference path="../math/Extent.ts"/>
/// <reference path="../shape/Legend.ts"/>

module semio.chart {
    import ColorPalette = semio.core.ColorPalette;
    import CategoricalPlotable = semio.interfaces.CategoricalPlotable;
    import Context = semio.interfaces.Context;
    import Margin = semio.interfaces.Margin;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    import VerticalViolin = semio.shape.VerticalViolin;
    import Extent = semio.math.Extent;
    import Legend = semio.shape.Legend;

    export class CategoricalPlot implements Plotable {
        private _valueExtentWidening: number = 0.12;
        private _background: string = "#e6e6e6";
        private _yTickStrokeRatio: number = 0.05;

        private _valueColumn: string;
        private _splitOnColumn: string;

        private _numericAccessor: (d: any) => number;
        private _categoricalAccessor: (d: any) => string;

        private _marginRatioWithLegend: Margin = {
            bottom: 0.08,
            left: 0.08,
            right: 0.12,
            top: 0.02
        };

        private _marginRatioWithoutLegend: Margin = {
            bottom: 0.08,
            left: 0.08,
            right: 0.02,
            top: 0.02
        };

        private _marginRatioOverride: Margin;

        private _plotables: Array<CategoricalPlotable> = [];

        public background(colour: string): CategoricalPlot {
            this._background = colour;
            return this;
        }

        public value(column: string): CategoricalPlot {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        }

        public splitOn(column: string): CategoricalPlot {
            this._splitOnColumn = column;
            this._categoricalAccessor = function (d) {
                return d[column].toString();
            };
            return this;
        }

        public marginRatio(marginRatio: Margin): CategoricalPlot {
            this._marginRatioOverride = marginRatio;
            return this;
        }

        public getCategoricalColumns(): Array<string> {
            let columns: Array<string> = [];
            this._plotables.forEach((pl) => {
                columns = columns.concat(pl.getCategoricalColumns());
            });
            columns.push(this._splitOnColumn);
            return _.union(columns);
        }

        public getNumericColumns(): Array<string> {
            if (this._valueColumn) {
                return [this._valueColumn];
            }
            return [];
        }

        public add(plotable: CategoricalPlotable): CategoricalPlot {
            this._plotables.push(plotable);
            return this;
        }

        public plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data) {
                return;
            }

            let legendColumns: Array<string> = [];

            this._plotables.forEach((pl) => {
                pl.value(this._valueColumn).splitOn(this._splitOnColumn);
                let legendCol = pl.getLegendColumn();
                if (legendCol) {
                    legendColumns.push(legendCol);
                }
            });

            let marginRatio = this._marginRatioOverride ||
                (legendColumns.length ? this._marginRatioWithLegend : this._marginRatioWithoutLegend);

            let plotAreaX = marginRatio.left * surface.getWidth();
            let plotAreaY = marginRatio.top * surface.getHeight();
            let plotAreaWidth = (1 - marginRatio.left - marginRatio.right) * surface.getWidth();
            let plotAreaHeight = (1 - marginRatio.top - marginRatio.bottom) * surface.getHeight();
            let xAxisAreaHeight = marginRatio.bottom * surface.getHeight();
            let yAxisAreaWidth = marginRatio.left * surface.getWidth();

            // Add background to plot area
            surface.svg.append("g")
                .append("rect")
                .attr("width", plotAreaWidth)
                .attr("height", plotAreaHeight)
                .attr("x", plotAreaX)
                .attr("y", plotAreaY)
                .attr("fill", this._background);

            // Draw y axis
            let yExtent = context.getOrCalculateNumericRange(data, this._valueColumn);
            yExtent = Extent.widen(yExtent, this._valueExtentWidening);
            let yScale = d3.scale.linear()
                .domain(yExtent)
                .range([plotAreaHeight, 0]);
            let yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .tickSize(-plotAreaWidth, 0);
            let yAxisGroup = surface.svg.append("g")
                .attr("transform", "translate(" + plotAreaX + "," + plotAreaY + ")")
                .call(yAxis);
            yAxisGroup.selectAll(".tick line")
                .style({
                    "stroke" : "white",
                    "stroke-width" : plotAreaHeight * this._yTickStrokeRatio / yAxis.ticks()[0]
                });
            yAxisGroup.selectAll(".tick text")
                .attr("font-size", yAxisAreaWidth / 3);
            surface.svg.append("svg").append("text")
                .attr("font-size", yAxisAreaWidth / 3)
                .attr("text-anchor", "middle")
                .attr("transform", "translate(" + yAxisAreaWidth / 4 + "," + (plotAreaY + plotAreaHeight / 2) + ")rotate(-90)")
                .text(this._valueColumn);

            let updatedContext = context.setYScale(this._valueColumn, yScale);

            if (this._splitOnColumn) {
                // Draw x axis
                let categories = context.getCategoryValues(this._splitOnColumn);
                let categoryColor = context.getCategoryColours(this._splitOnColumn) || ColorPalette.qualitative(categories);
                let categoryWidth = plotAreaWidth / categories.length;

                let xScale = d3.scale.ordinal()
                    .domain(categories)
                    .rangePoints([categoryWidth / 2, plotAreaWidth - categoryWidth / 2]);
                let xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickSize(0);
                let xAxisGroup = surface.svg.append("g")
                    .attr("transform", "translate(" + plotAreaX + "," + (plotAreaY + plotAreaHeight) + ")")
                    .call(xAxis);
                xAxisGroup.selectAll(".tick text")
                    .attr("font-size", xAxisAreaHeight / 3);
                surface.svg.append("g").append("text")
                    .attr("font-size", xAxisAreaHeight / 3)
                    .attr("text-anchor", "middle")
                    .attr("transform",
                          "translate(" + (plotAreaX + plotAreaWidth / 2) + "," +
                                         (plotAreaY + plotAreaHeight + xAxisAreaHeight * 3 / 4) + ")")
                    .text(this._splitOnColumn);

                updatedContext = updatedContext.setXScale(this._splitOnColumn, xScale);
            }

            let plotSurface = surface.addSurface("plotablearea", plotAreaX, plotAreaY, plotAreaWidth, plotAreaHeight);
            this._plotables.forEach((pl) => {
                pl.plot(data, plotSurface, updatedContext);
            });

            if (legendColumns) {
                let legendAreaX = (1 - marginRatio.right) * surface.getWidth();
                let legendAreaY = plotAreaY;
                let legendAreaWidth = marginRatio.right * surface.getWidth();
                let legendAreaHeight = plotAreaHeight;

                let legendSurface = surface.addSurface("legendarea", legendAreaX, legendAreaY, legendAreaWidth, legendAreaHeight);
                let legend = new Legend();

                legendColumns.forEach((col) => legend.addColumn(col));
                legend.draw(legendSurface, context);
            }
        }
    }
}
