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
        
        numeric(accessor: (d: any) => number | string): violinplot {
            this._numericAccessor = function (d) {
                return +accessor(d);
            };;
            return this;
        } 
        
        draw(containerSelector: string): void {
            if (!this.data)
                return;
           
            let svg = d3.select(containerSelector)
                .append('svg')
                .attr('width', this._width)
                .attr('height', this._height);

            let categoricalValues = d3.set(this.data.map(this._categoricalAccessor)).values();
            let xScale = d3.scale.ordinal()
                .domain(categoricalValues)
                .rangePoints([0.1 * this._width, 0.9 * this._width]);
            let xAxis = d3.svg.axis().scale(xScale).orient('bottom');
            let xAxisGroup = svg.append('g')
                .attr('transform', 'translate(0,' + (0.92 * this._height) + ')')
                .call(xAxis);
            
            let yExtent = d3.extent(this.data, this._numericAccessor);
            let yScale = d3.scale.linear()
                .domain(yExtent)
                .range([0.9 * this._height, 0.1 * this._height]);
            let yAxis = d3.svg.axis().scale(yScale).orient('left');
            let yAxisGroup = svg.append('g')
                .attr('transform', 'translate(' + (0.1 * this._height) + ',0)')
                .call(yAxis);
            
            svg.selectAll('circle')
                .data(this.data)
                .enter()
                .append('circle')
                .attr('fill', 'black')
                .attr('r', 5)
                .attr('cx', d => xScale(this._categoricalAccessor(d)))
                .attr('cy', d => yScale(this._numericAccessor(d)));
        }
    }
}