/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Margin.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>
/// <reference path="../interfaces/TwoDimensionalPlotable.ts"/>
/// <reference path="../shape/Legend.ts"/>

namespace semio.chart {
    import Context = semio.interfaces.Context;
    import Margin = semio.interfaces.Margin;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    import TwoDimensionalPlotable = semio.interfaces.TwoDimensionalPlotable;
    import Legend = semio.shape.Legend;

    export class Plot2D implements Plotable {
        private _valueExtentWidening: number = 0.12;
        private _background: string = "#e6e6e6";
        private _xTickStrokeRatio: number = 0.05;
        private _yTickStrokeRatio: number = 0.05;

        private _xColumn: string;
        private _yColumn: string;

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

        private _plotables: Array<TwoDimensionalPlotable> = [];

        public background(colour: string): Plot2D {
            this._background = colour;
            return this;
        }

        public xColumn(column: string): Plot2D {
            this._xColumn = column;
            return this;
        }

        public yColumn(column: string): Plot2D {
            this._yColumn = column;
            return this;
        }

        public marginRatio(marginRatio: Margin): Plot2D {
            this._marginRatioOverride = marginRatio;
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

            let legendColumns: Array<string> = [];

            this._plotables.forEach((pl) => {
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

            let xColumnExtent = context.getOrCalculateNumericRange(data, this._xColumn);
            let yColumnExtent = context.getOrCalculateNumericRange(data, this._yColumn);

            let xPadding = d3.max(this._plotables.map((pl) => pl.getXPadding()));
            let yPadding = d3.max(this._plotables.map((pl) => pl.getYPadding()));

            let xScale = d3.scale.linear()
                    .domain(xColumnExtent)
                    .range([0 + 2 * xPadding, plotAreaWidth - 2 * xPadding]);
            let yScale = d3.scale.linear()
                    .domain(yColumnExtent)
                    .range([plotAreaHeight - 2 * yPadding, 0 + 2 * yPadding]);

            // Add background to plot area
            surface.svg.append("g")
                .append("rect")
                .attr("width", plotAreaWidth)
                .attr("height", plotAreaHeight)
                .attr("x", plotAreaX)
                .attr("y", plotAreaY)
                .attr("fill", this._background);

            // Draw x-axis
            let xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .tickSize(-plotAreaHeight, 0);
            let xAxisGroup = surface.svg.append("g")
                .attr("transform", "translate(" + plotAreaX + "," + (plotAreaY + plotAreaHeight) + ")")
                .call(xAxis);
            xAxisGroup.selectAll(".tick line")
                .style({
                    "stroke" : "white",
                    "stroke-width" : plotAreaWidth * this._xTickStrokeRatio / xAxis.ticks()[0]
                });
            xAxisGroup.selectAll(".tick text")
                .attr("font-size", xAxisAreaHeight / 3);
            surface.svg.append("svg").append("text")
                .attr("font-size", xAxisAreaHeight / 3)
                .attr("text-anchor", "middle")
                .attr("transform", "translate(" + (plotAreaX + plotAreaWidth / 2) + "," +
                                                  (plotAreaY + plotAreaHeight + xAxisAreaHeight * 3 / 4) + ")")
                .text(this._xColumn);

            // Draw y-axis
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
                .text(this._yColumn);

            let updatedContext = context.setXScale(this._xColumn, xScale)
                .setYScale(this._yColumn, yScale);

            let plotSurface = surface.addSurface("plotablearea", plotAreaX, plotAreaY, plotAreaWidth, plotAreaHeight);

            this._plotables.forEach((pl) => {
                pl.xColumn(this._xColumn)
                    .yColumn(this._yColumn)
                    .plot(data, plotSurface, updatedContext);
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
