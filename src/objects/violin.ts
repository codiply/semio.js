/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../stats/kde.ts"/>

module semio.objects {
    export class verticalViolin {
        
        private _cx: number;
        private _yAccessor: (d: any) => number;
        private _yScale: (x: number) => number;
        private _width: number;
        private _fill: string;
        private _cut: number = 1;
        private _bandwidth: number;
        
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
        
        cut(cut: number): verticalViolin {
            this._cut = cut;
            return this;
        }
        
        bandwidth(bandwidth: number): verticalViolin {
            this._bandwidth = bandwidth;
            return this;
        }
        
        draw(svg: d3.Selection<any>): void {
            let yMin = d3.min(this._data, this._yAccessor);
            let yMax = d3.max(this._data, this._yAccessor);

            let support = _.range(this._yScale(yMax + this._cut), 
                                  this._yScale(yMin - this._cut), 1);

            let kernel = semio.stats.kde.epanechnikovKernel;
            let densities = semio.stats.kde.estimate(kernel, 
                this._data.map(this._yAccessor).map(this._yScale), this._bandwidth, support);
            let maxDensity = d3.max(densities, (d) => d.density);
            // Scale densities         
            densities.forEach((d) => {
                d.density = 0.5 * this._width * d.density / maxDensity;
            });

            let area = d3.svg.area<stats.kdePoint>()
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