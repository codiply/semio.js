/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../core/ColorPalette.ts"/>
/// <reference path="../interfaces/CategoricalPlotable.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/MarginRatio.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>
/// <reference path="../math/Extent.ts"/>

module semio.chart {
    import ColorPalette = semio.core.ColorPalette;
    import CategoricalPlotable = semio.interfaces.CategoricalPlotable;
    import Context = semio.interfaces.Context;
    import MarginRatio = semio.interfaces.MarginRatio;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    import VerticalViolin = semio.shape.VerticalViolin;
    import Extent = semio.math.Extent;
    
    export class CategoricalPlot implements Plotable {
        private _valueExtentWidening: number = 0.12;
        private _background: string = '#e6e6e6'; 
        private _yTickStrokeRatio: number = 0.05;
        
        private _valueColumn: string;
        private _splitOnColumn: string;
        
        private _numericAccessor: (d: any) => number;
        private _categoricalAccessor: (d: any) => string;
        
        private _marginRatio: MarginRatio = {
            top: 0.02,
            right: 0.02,
            bottom: 0.08,
            left: 0.08  
        };
        
        private _plotables: Array<CategoricalPlotable> = [];

        background(colour: string): CategoricalPlot {
            this._background = colour;
            return this;
        }

        value(column: string): CategoricalPlot {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        } 
        
        splitOn(column: string): CategoricalPlot {
            this._splitOnColumn = column;
            this._categoricalAccessor = function (d) {
                return d[column].toString();
            };
            return this;
        } 
        
        marginRatio(marginRatio: MarginRatio): CategoricalPlot {
            this._marginRatio = marginRatio;
            return this;
        }
        
        getCategoricalColumns(): Array<string> {
            let columns = _.flatMap(this._plotables, (p) => p.getCategoricalColumns());
            columns.push(this._splitOnColumn);
            return columns;
        }
        
        getNumericColumns(): Array<string> {
            if (this._valueColumn) {
                return [this._valueColumn];
            }
            return [];
        }
        
        add(plotable: CategoricalPlotable): CategoricalPlot {
            this._plotables.push(plotable);
            return this;
        }
        
        plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data)
                return;
                
            let plotAreaX = this._marginRatio.left * surface.getWidth();
            let plotAreaY = this._marginRatio.top * surface.getHeight();
            let plotAreaWidth = (1 - this._marginRatio.left - this._marginRatio.right) * surface.getWidth();
            let plotAreaHeight = (1 - this._marginRatio.top - this._marginRatio.bottom) * surface.getHeight();
            let xAxisAreaHeight = this._marginRatio.bottom * surface.getHeight();
            let yAxisAreaWidth = this._marginRatio.left * surface.getWidth();
 
            // Add background to plot area
            surface.svg.append('g')
                .append('rect')
                .attr('width', plotAreaWidth)
                .attr('height', plotAreaHeight)
                .attr('x', plotAreaX)
                .attr('y', plotAreaY)
                .attr('fill', this._background);
            
            // Draw y axis
            let yExtent = context.getNumericRange(this._valueColumn) || d3.extent(data, this._numericAccessor);
            yExtent = Extent.widen(yExtent, this._valueExtentWidening);
            let yScale = d3.scale.linear()
                .domain(yExtent)
                .range([plotAreaY + plotAreaHeight, plotAreaY]);
            let yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickSize(-plotAreaWidth, 0);
            let yAxisGroup = surface.svg.append('g')
                .attr('transform', 'translate(' + plotAreaX + ',' + plotAreaY + ')')
                .call(yAxis);
            yAxisGroup.selectAll('.tick line')
                .style({
                    'stroke' : 'white',
                    'stroke-width' : plotAreaHeight * this._yTickStrokeRatio / yAxis.ticks()[0]
                });
            yAxisGroup.selectAll('.tick text')
                .attr('font-size', yAxisAreaWidth / 3)
            surface.svg.append('svg').append('text')
                .attr('font-size', yAxisAreaWidth / 3)
                .attr('text-anchor', 'middle')
                .attr('transform', 'translate(' + yAxisAreaWidth / 4 + ',' + (plotAreaY + plotAreaHeight / 2) + ')rotate(-90)')
                .text(this._valueColumn);
            
            let updatedContext = context.setYScale(this._valueColumn, yScale);
            
            // Draw x axis
            let categories = context.getCategoryValues(this._splitOnColumn);
            let categoryColor = context.getCategoryColours(this._splitOnColumn) || ColorPalette.qualitative(categories);
            let categoryWidth = plotAreaWidth / categories.length;
            
            let xScale = d3.scale.ordinal()
                .domain(categories)
                .rangePoints([plotAreaX + categoryWidth / 2, 
                              plotAreaX + plotAreaWidth - categoryWidth / 2]);
            let xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .tickSize(0);
            let xAxisGroup = surface.svg.append('g')
                .attr('transform', 'translate(0,' + (plotAreaY + plotAreaHeight) + ')')
                .call(xAxis);
            xAxisGroup.selectAll('.tick text')
                .attr('font-size', xAxisAreaHeight / 3)
            surface.svg.append('g').append('text')
                .attr('font-size', xAxisAreaHeight / 3)
                .attr('text-anchor', 'middle')  
                .attr('transform', 'translate(' + (plotAreaX + plotAreaWidth / 2) + ',' + (plotAreaY + plotAreaHeight + xAxisAreaHeight * 3 / 4) + ')')
                .text(this._splitOnColumn);
                          
            updatedContext = updatedContext.setXScale(this._splitOnColumn, (x: string) => xScale(x) - plotAreaX); 
                          
            let plotSurface = surface.addSurface('plotablearea', plotAreaX, plotAreaY, plotAreaWidth, plotAreaHeight);     
            this._plotables.forEach((pl) => {
                pl.value(this._valueColumn).splitOn(this._splitOnColumn);
                pl.plot(data, plotSurface, updatedContext);
            });
        }
    }
}