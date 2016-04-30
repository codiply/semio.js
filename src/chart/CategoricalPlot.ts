/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.chart {
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    import VerticalViolin = semio.shape.VerticalViolin;
    
    export class CategoricalPlot implements Plotable {   
        private _background: string = '#e6e6e6'; 
        
        private _valueColumn: string;
        private _splitOnColumn: string;
        
        private _numericAccessor: (d: any) => number;
        private _categoricalAccessor: (d: any) => string;
        
        private _xAxisHeightRatio: number = 0.1;
        private _yAxisWidthRatio: number = 0.1;
        
        private _plotables: Array<Plotable> = [];

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
        
        xAxisHeightRatio(ratio: number): CategoricalPlot {
            this._xAxisHeightRatio = ratio;
            return this;
        }
        
        yAxisWidthRatio(ratio: number): CategoricalPlot {
            this._yAxisWidthRatio = ratio;
            return this;
        }
        
        getCategoricalColumns(): Array<string> {
            let columns = _.flatMap(this._plotables, (p) => p.getCategoricalColumns());
            columns.push(this._splitOnColumn);
            return columns;
        }
        
        getNumericColumns(): Array<string> {
            if (this._splitOnColumn) {
                return [this._splitOnColumn];
            }
            return [];
        }
        
        add(plotable: Plotable): Plotable {
            this._plotables.push(plotable);
            return this;
        }
        
        plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data || !this._plotables)
                return;
                
            // Add background to plot area
            let plotAreaX = this._yAxisWidthRatio * surface.getWidth();
            let plotAreaY = 0;
            let plotAreaWidth = (1 - this._yAxisWidthRatio) * surface.getWidth();
            let plotAreaHeight = (1 - this._xAxisHeightRatio) * surface.getHeight();
            surface.svg.append('g')
                .append('rect')
                .attr('width', plotAreaWidth)
                .attr('height', plotAreaHeight)
                .attr('x', plotAreaX)
                .attr('y', plotAreaY)
                .attr('fill', this._background);
            
            // Draw x axis
            let categories = context.getCategoryValues()[this._splitOnColumn] || d3.set(data.map(this._categoricalAccessor)).values();     
            // TODO: extract the colour scale creation to a helper that can handle more than 20 colours
            let categoryColor = context.getCategoryColours()[this._splitOnColumn] || d3.scale.category20().domain(categories);
            let categoryWidth = plotAreaWidth / categories.length;
            
            let xScale = d3.scale.ordinal()
                .domain(categories)
                .rangePoints([plotAreaX + categoryWidth / 2, 
                              plotAreaX + plotAreaWidth - categoryWidth / 2]);
            let xAxis = d3.svg.axis().scale(xScale).orient('bottom');
            let xAxisGroup = surface.svg.append('g')
                .attr('transform', 'translate(0,' + plotAreaHeight + ')')
                .call(xAxis);
            
            // Draw y axis
            let yExtent = context.getNumericRange(this._valueColumn) || d3.extent(data, this._numericAccessor);
            let yScale = d3.scale.linear()
                .domain(yExtent)
                .range([plotAreaY + plotAreaHeight, plotAreaY]);
            let yAxis = d3.svg.axis().scale(yScale).orient('left');
            let yAxisGroup = surface.svg.append('g')
                .attr('transform', 'translate(' + plotAreaX + ',0)')
                .call(yAxis);
                           
            let groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
           
            _.forOwn(groupedData, (group) => {
                let updatedContext = context.setSlicedColumn(this._splitOnColumn, group.key);
                let data = group.values;
            });
        }
    }
}