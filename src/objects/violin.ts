/// <reference path="../../typings/d3/d3.d.ts"/>

module semio.objects {
    export class verticalViolin {
        
        private _cx: number;
        private _yAccessor: (d: any) => number;
        private _yScale: (x: number) => number;
        private _width: number;
        
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
        
        draw(svg: d3.Selection<any>): void {
            var yTop = this._yScale(d3.max(this._data, this._yAccessor));
            var yBottom = this._yScale(d3.min(this._data, this._yAccessor));
            svg.append('rect')
               .attr('width', this._width)
               .attr('height', yBottom - yTop)
               .attr('x', this._cx - this._width / 2)
               .attr('y', yTop)
               .attr('fill', 'black')
               .attr('stroke-width', 5);
        }
    }
}