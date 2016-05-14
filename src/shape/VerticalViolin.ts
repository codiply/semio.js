/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Surface.ts"/>
/// <reference path="../math/Kde.ts"/>

module semio.shape {
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;
    import Kde = semio.math.Kde;
    import KdePoint = semio.math.KdePoint;
    
    export interface PreDrawResult {
        maxDensity: number,
        count: number
    }
    
    export class VerticalViolin {
        private _defaultFill: string = '#1f77b4';
        private _valueColumn: string;
        private _fill: string;
        private _extend: number = 0.2;
        private _bandwidth: number;
        private _numericAccessor: (d: any) => number;
        
        private _densities: Array<KdePoint>;
        private _maxDensity: number;
            
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
        
        extend(ratio: number): VerticalViolin {
            this._extend = ratio;
            return this;
        }
        
        bandwidth(bandwidth: number): VerticalViolin {
            this._bandwidth = bandwidth;
            return this;
        }
        
        preDraw(data:Array<any>): PreDrawResult {
            if (!data)
                return;
                
            let yMin = d3.min(data, this._numericAccessor);
            let yMax = d3.max(data, this._numericAccessor);

            let support = _.range(yMin, yMax, 0.01);

            let kernel = Kde.epanechnikovKernel;
            let values = data.map(this._numericAccessor);
            let bandwidth = 1.06 * d3.deviation(values) / Math.pow(values.length, 0.2);
            this._densities = Kde.estimate(kernel, values, bandwidth, support);
            this._maxDensity = d3.max(this._densities, (d) => d.density); 
            return { 
                maxDensity: this._maxDensity,
                count: data.length
            };    
        }
        
        draw(surface: Surface, context: Context): void {
            if (!this._densities)
                return;
                
            let centre = surface.getWidth() / 2;

            var yScale = context.getYScale(this._valueColumn);   

            this._densities.forEach((d) => {
                d.density = 0.45 * surface.getWidth() * d.density / this._maxDensity;
            });

            let area = d3.svg.area<KdePoint>()
               .y(d => yScale(d.value))
               .x0(d => centre - d.density)
               .x1(d => centre + d.density);
           
            let violin = surface.svg.append('g')
                 .append('path')
                 .datum(this._densities)
                 .attr('d', area)
                 .style('fill', this._fill || this._defaultFill);
               
            let tooltipLines: Array<string> = [];
            context.getSlicedColumns().forEach((column) => {
                tooltipLines.push(column + ': ' + context.getSlicedColumnValue(column));
            });
            if (tooltipLines) {
                context.getTooltip().addOn(violin, () => {
                    return tooltipLines.join('<br/>');
                });
            }
        }
    }
}