/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Surface.ts"/>
/// <reference path="../math/Kde.ts"/>

module semio.shape {
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;
    import Kde = semio.math.Kde;
    import KdePoint = semio.math.KdePoint;
    
    export class VerticalViolin {
        
        private _valueColumn: string;
        private _fill: string;
        private _cut: number = 1;
        private _bandwidth: number;
        private _numericAccessor: (d: any) => number;
            
        value(column: string): VerticalViolin {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
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
        
        draw(data: Array<any>, surface: Surface, context: Context): void {
            let centre = surface.getWidth() / 2;

            var yScale = context.getYScale(this._valueColumn);      
            
            let yMin = d3.min(data, this._numericAccessor;
            let yMax = d3.max(data, this._numericAccessor);

            let support = _.range(yScale(yMax + this._cut), 
                                  yScale(yMin - this._cut), 5);

            let kernel = Kde.epanechnikovKernel;
            let values = data.map(this._numericAccessor).map(yScale);
            let bandwidth = 1.06 * d3.deviation(values) / Math.pow(values.length, 0.2);
            let densities = Kde.estimate(kernel, values, bandwidth, support);
            let maxDensity = d3.max(densities, (d) => d.density);
            // Scale densities         
            densities.forEach((d) => {
                d.density = 0.45 * surface.getWidth() * d.density / maxDensity;
            });

            let area = d3.svg.area<KdePoint>()
               .y(d => d.value)
               .x0(d => centre - d.density)
               .x1(d => centre + d.density);
           
          surface.svg.append('g')
               .append('path')
               .datum(densities)
               .attr('d', area)
               .style('fill', this._fill);
        }
    }
}