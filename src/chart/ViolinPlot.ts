/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Environment.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>
/// <reference path="../shape/VerticalViolin.ts"/>

module semio.chart {
    import Environment = semio.interfaces.Environment;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    import VerticalViolin = semio.shape.VerticalViolin;
    
    export class ViolinPlot implements Plotable {
        private xMargin: number = 0.1;
        private yMargin: number = 0.1;
        private splitOnColumn: string;
        private categoricalAccessor: (d: any) => string;
        private numericAccessor: (d: any) => number;
        private categoryColumns: Array<string> = [];

        value(column: string): ViolinPlot {
            this.numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        } 
        
        splitOn(column: string): ViolinPlot {
            this.categoricalAccessor = function (d) {
                return d[column].toString();
            };
            this.splitOnColumn = column;
            this.categoryColumns.push(column);
            return this;
        } 
        
        getCategoryColumns(): Array<string> {
            return this.categoryColumns;
        }
        
        plot(surface: Surface, environment: Environment, data: Array<any>): void {
            if (!data)
                return;
            
            let plotableWidth = (1 - 2 * this.yMargin) * surface.getWidth();
            let categories = d3.set(data.map(this.categoricalAccessor)).values();     
            let categoryWidth = plotableWidth / categories.length;
            
            let environmentColours = environment.getCategoryColours()[this.splitOnColumn];
            var categoryColor = environmentColours ? environmentColours : d3.scale.category20().domain(categories);
            let xScale = d3.scale.ordinal()
                .domain(categories)
                .rangePoints([this.xMargin * surface.getWidth() + categoryWidth / 2, 
                              (1 - this.xMargin) * surface.getWidth() - categoryWidth / 2]);
            let xAxis = d3.svg.axis().scale(xScale).orient('bottom');
            let xAxisGroup = surface.svg.append('g')
                .attr('transform', 'translate(0,' + ((1 - this.yMargin * 0.8) * surface.getHeight()) + ')')
                .call(xAxis);
            
            let yExtent = d3.extent(data, this.numericAccessor);
            let yScale = d3.scale.linear()
                .domain(yExtent)
                .range([(1 - this.yMargin) * surface.getHeight(), this.yMargin * surface.getHeight()]);
            let yAxis = d3.svg.axis().scale(yScale).orient('left');
            let yAxisGroup = surface.svg.append('g')
                .attr('transform', 'translate(' + (this.yMargin * surface.getHeight()) + ',0)')
                .call(yAxis);
                           
            let groupedData = d3.nest().key(this.categoricalAccessor).entries(data);
           
            _.forOwn(groupedData, (group) => {
                let violin = new VerticalViolin(group.values);
                violin.cx(xScale(group.key))
                    .yScale(yScale)
                    .yAccessor(this.numericAccessor)
                    .width(0.8 * categoryWidth)
                    .cut(1)
                    .fill(categoryColor(group.key));
                violin.draw(surface.svg);
            });
        }
    }
}