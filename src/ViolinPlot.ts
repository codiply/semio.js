/// <reference path="../typings/d3/d3.d.ts"/>

module semio {
    export class violinplot {
        private _x: number = 0;
        private _y: number = 0;
        private _width: number = 720;
        private _height: number = 720;
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
        
        numeric(accessor: (d: any) => number): violinplot {
            this._numericAccessor = accessor;
            return this;
        } 
        
        draw(containerSelector: string): void {
            if (!this.data)
                return;
                
            let xExtent = d3.extent(this.data, this._numericAccessor);
            let xScale = d3.scale.linear()
                .domain(xExtent)
                .range([0.1 * this._width, 0.9 * this._width]);
            
            let categoricalValues = d3.set(this.data.map(this._categoricalAccessor)).values();
            let yScale = d3.scale.ordinal()
                .domain(categoricalValues)
                .rangePoints([0.1 * this._height, 0.9 * this._height]);
            
            var svg = d3.select(containerSelector)
                .append('svg')
                .attr('width', this._width)
                .attr('height', this._height);
            
            svg.selectAll('circle')
                .data(this.data)
                .enter()
                .append('circle')
                .attr('fill', 'black')
                .attr('r', 5)
                .attr('cx', d => xScale(this._numericAccessor(d)))
                .attr('cy', d => yScale(this._categoricalAccessor(d)));
        }
    }
}