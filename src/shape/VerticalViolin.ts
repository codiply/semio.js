/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../math/Kde.ts"/>

module semio.shape {
    import Kde = semio.math.Kde;
    import KdePoint = semio.math.KdePoint;
    
    export class VerticalViolin {
        
        private _cx: number;
        private _yAccessor: (d: any) => number;
        private _yScale: (x: number) => number;
        private _width: number;
        private _fill: string;
        private _cut: number = 1;
        private _bandwidth: number;
        
        constructor(private _data: Array<any>) { }
        
        cx(cx: number): VerticalViolin {
            this._cx = cx;
            return this;
        }
        
        yAccessor(accessor: (d: any) => number): VerticalViolin {
            this._yAccessor = accessor;
            return this;
        }
        
        yScale(scale: (y: number) => number): VerticalViolin {
            this._yScale = scale;
            return this;
        }
        
        width(width: number): VerticalViolin {
            this._width = width;
            return this;
        }
        
        fill(fill: string): VerticalViolin {
            this._fill = fill;
            return this;
        }
        
        cut(cut: number): VerticalViolin {
            this._cut = cut;
            return this;
        }
        
        bandwidth(bandwidth: number): VerticalViolin {
            this._bandwidth = bandwidth;
            return this;
        }
        
        draw(svg: d3.Selection<any>): void {
            let yMin = d3.min(this._data, this._yAccessor);
            let yMax = d3.max(this._data, this._yAccessor);

            let support = _.range(this._yScale(yMax + this._cut), 
                                  this._yScale(yMin - this._cut), 5);

            let kernel = Kde.epanechnikovKernel;
            let values = this._data.map(this._yAccessor).map(this._yScale);
            let bandwidth = 1.06 * d3.deviation(values) / Math.pow(values.length, 0.2);
            let densities = Kde.estimate(kernel, values, bandwidth, support);
            let maxDensity = d3.max(densities, (d) => d.density);
            // Scale densities         
            densities.forEach((d) => {
                d.density = 0.5 * this._width * d.density / maxDensity;
            });

            let area = d3.svg.area<KdePoint>()
               .y(d => d.value)
               .x0(d => this._cx - d.density)
               .x1(d => this._cx + d.density);
           
           svg.append('g')
               .append('path')
               .datum(densities)
               .attr('d', area)
               .style('fill', this._fill);
        }
    }
}