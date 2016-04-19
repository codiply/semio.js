/// <reference path="../typings/d3/d3.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>
/// <reference path="objects/violin.ts"/>

module semio {
    import ExportedClass = semio.objects.verticalViolin;
    
    export class violinplot {
        private _x: number = 0;
        private _y: number = 0;
        private _width: number = 720;
        private _height: number = 720;
        private _xMargin: number = 0.1;
        private _yMargin: number = 0.1;
        private _categoricalAccessor: (d: any) => string;
        private _numericAccessor: (d: any) => number;
        
        constructor(private data: Array<any>) { }
                
        x(x: number): violinplot {
            this._x = x;
            return this;
        }
        
        y(y: number): violinplot {
            this._y = y;
            return this;
        }
        
        width(width: number): violinplot {
            this._width = width;
            return this;
        }
        
        height(height: number): violinplot {
            this._height = height;
            return this;
        }
        
        categorical(accessor: (d: any) => d3.Primitive): violinplot {
            this._categoricalAccessor = function (d) {
                return accessor(d).toString();
            };
            return this;
        } 
        
        numeric(accessor: (d: any) => number | string): violinplot {
            this._numericAccessor = function (d) {
                return +accessor(d);
            };
            return this;
        } 
        
        draw(containerSelector: string): void {
            if (!this.data)
                return;
           
            let svg = d3.select(containerSelector)
                .append('svg')
                .attr('x', this._x)
                .attr('y', this._y)
                .attr('width', this._width)
                .attr('height', this._height);
            
            let plotableWidth = (1 - 2 * this._yMargin) * this._width;
            let categories = d3.set(this.data.map(this._categoricalAccessor)).values();     
            let categoryWidth = plotableWidth / categories.length;
            
            var categoryColor = d3.scale.category20().domain(categories);
            let xScale = d3.scale.ordinal()
                .domain(categories)
                .rangePoints([this._xMargin * this._width + categoryWidth / 2, 
                              (1 - this._xMargin) * this._width - categoryWidth / 2]);
            let xAxis = d3.svg.axis().scale(xScale).orient('bottom');
            let xAxisGroup = svg.append('g')
                .attr('transform', 'translate(0,' + ((1 - this._yMargin * 0.8) * this._height) + ')')
                .call(xAxis);
            
            let yExtent = d3.extent(this.data, this._numericAccessor);
            let yScale = d3.scale.linear()
                .domain(yExtent)
                .range([(1 - this._yMargin) * this._height, this._yMargin * this._height]);
            let yAxis = d3.svg.axis().scale(yScale).orient('left');
            let yAxisGroup = svg.append('g')
                .attr('transform', 'translate(' + (this._yMargin * this._height) + ',0)')
                .call(yAxis);
                           
           let groupedData = d3.nest().key(this._categoricalAccessor).entries(this.data);
           
           _.forOwn(groupedData, (group) => {
              let violin = new semio.objects.verticalViolin(group.values);
              violin.cx(xScale(group.key))
                    .yScale(yScale)
                    .yAccessor(this._numericAccessor)
                    .width(0.9 * categoryWidth)
                    .fill(categoryColor(group.key));
              violin.draw(svg);
           });
        }
    }
}