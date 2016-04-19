/// <reference path="../../typings/d3/d3.d.ts"/>

module semio.objects {
    export class verticalViolin {
        
        private _cx: number;
        private _yAccessor: (d: any) => number;
        private _yScale: (x: number) => number;
        private _width: number;
        private _fill: string;
        
        constructor(private _data: Array<any>) { }
        
        cx(cx: number): verticalViolin {
            this._cx = cx;
            return this;
        }
        
        yAccessor(accessor: (d: any) => number): verticalViolin {
            this._yAccessor = accessor;
            return this;
        }
        
        yScale(scale: (y: number) => number): verticalViolin {
            this._yScale = scale;
            return this;
        }
        
        width(width: number): verticalViolin {
            this._width = width;
            return this;
        }
        
        fill(fill: string): verticalViolin {
            this._fill = fill;
            return this;
        }
        
        draw(svg: d3.Selection<any>): void {
            let yMax = d3.max(this._data, this._yAccessor);
            let yMin = d3.min(this._data, this._yAccessor);
            let yTop = this._yScale(yMax);
            let yBottom = this._yScale(yMin);
            
            svg.append('rect')
               .attr('width', this._width)
               .attr('height', yBottom - yTop)
               .attr('x', this._cx - this._width / 2)
               .attr('y', yTop)
               .attr('fill', this._fill)
               .attr('stroke-width', 5);
        }
    }
}