/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>
/// <reference path="../shape/VerticalViolin.ts"/>

module semio.chart {
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    import VerticalViolin = semio.shape.VerticalViolin;
    
    export class ViolinPlot implements Plotable {
        private _xMargin: number = 0.1;
        private _yMargin: number = 0.1;
        
        private _valueColumn: string;
        private _splitOnColumn: string;
        
        private _numericAccessor: (d: any) => number;
        private _categoricalAccessor: (d: any) => string;
        
        value(column: string): ViolinPlot {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        } 
        
        splitOn(column: string): ViolinPlot {
            this._splitOnColumn = column;
            this._categoricalAccessor = function (d) {
                return d[column].toString();
            };
            return this;
        } 
        
        getCategoricalColumns(): Array<string> {
            return [this._splitOnColumn];
        }
        
        getNumericColumns(): Array<string> {
            if (this._valueColumn) {
                return [this._valueColumn];
            }
            return [];
        }
        
        add(plotable: Plotable): Plotable {
            // Do nothing as this does not support nesting at the moment.
            return this;
        }
        
        plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data)
                return;
            
            let plotableWidth = (1 - 2 * this._yMargin) * surface.getWidth();
            let contextCategories = context ? 
                                        context.getCategoryValues()[this._splitOnColumn] : 
                                        undefined;
            let categories = contextCategories ? 
                             contextCategories : 
                             d3.set(data.map(this._categoricalAccessor)).values();     
            let categoryWidth = plotableWidth / categories.length;
            
            let contextColours = context ? context.getCategoryColours()[this._splitOnColumn] : undefined;
            let categoryColor = contextColours ? contextColours : d3.scale.category20().domain(categories);
            let xScale = d3.scale.ordinal()
                .domain(categories)
                .rangePoints([this._xMargin * surface.getWidth() + categoryWidth / 2, 
                              (1 - this._xMargin) * surface.getWidth() - categoryWidth / 2]);
            let xAxis = d3.svg.axis().scale(xScale).orient('bottom');
            let xAxisGroup = surface.svg.append('g')
                .attr('transform', 'translate(0,' + ((1 - this._yMargin * 0.8) * surface.getHeight()) + ')')
                .call(xAxis);
            
            let contextExtent = context.getNumericRange(this._valueColumn);
            let yExtent = contextExtent ? contextExtent : d3.extent(data, this._numericAccessor);
            let yScale = d3.scale.linear()
                .domain(yExtent)
                .range([(1 - this._yMargin) * surface.getHeight(), this._yMargin * surface.getHeight()]);
            let yAxis = d3.svg.axis().scale(yScale).orient('left');
            let yAxisGroup = surface.svg.append('g')
                .attr('transform', 'translate(' + (this._yMargin * surface.getHeight()) + ',0)')
                .call(yAxis);
                           
            let groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
           
            _.forOwn(groupedData, (group) => {
                let violin = new VerticalViolin(group.values);
                violin.cx(xScale(group.key))
                    .yScale(yScale)
                    .yAccessor(this._numericAccessor)
                    .width(0.8 * categoryWidth)
                    .cut(1)
                    .fill(categoryColor(group.key));
                violin.draw(surface.svg);
            });
        }
    }
}