/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Surface.ts"/>
/// <reference path="../math/Kde.ts"/>

module semio.shape {
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;
    import Kde = semio.math.Kde;
    import KdePoint = semio.math.KdePoint;
    
    export interface VerticalViolinPreDrawResult {
        count: number,
        maxDensity: number
    }
    
    export class VerticalViolin {
        private _defaultFill: string = "#1f77b4";
        private _valueColumn: string;
        private _fill: string;
        private _extend: number = 1;
        private _bandwidth: number;
        private _numericAccessor: (d: any) => number;
        private _delay: number;
        
        private _densities: Array<KdePoint>;
        private _maxDensity: number;
        private _area: number;
            
        public value(column: string): VerticalViolin {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        } 
        
        public fill(fill: string): VerticalViolin {
            this._fill = fill;
            return this;
        }
        
        public extend(extend: number): VerticalViolin {
            this._extend = extend;
            return this;
        }
        
        public bandwidth(bandwidth: number): VerticalViolin {
            this._bandwidth = bandwidth;
            return this;
        }
        
        public delay(delay: number): VerticalViolin {
            this._delay = delay;
            return this;
        }
        
        public  preDraw(data:Array<any>): VerticalViolinPreDrawResult {
            if (!data) {
                return;
            }
   
            let values = data.map(this._numericAccessor);

            if (!this._bandwidth) {
                this._bandwidth = 1.06 * d3.deviation(values) / Math.pow(values.length, 0.2);
            }

            let yMin = d3.min(data, this._numericAccessor);
            let yMax = d3.max(data, this._numericAccessor);

            let support = _.range(yMin - this._extend * this._bandwidth / 2, 
                                  yMax + this._extend * this._bandwidth / 2, this._bandwidth / 10);

            let kernel = Kde.epanechnikovKernel;
            this._densities = Kde.estimate(kernel, values, this._bandwidth, support);
            this._maxDensity = d3.max(this._densities, (d) => d.density);
            return { 
                count: data.length,
                maxDensity: this._maxDensity
            };    
        }

        public draw(surface: Surface, context: Context, widthRatio: number): void {
            if (!this._densities) {
                return;
            }
   
            let centre = surface.getWidth() / 2;

            let yScale = context.getYScale(this._valueColumn);   

            this._densities.forEach((d) => {
                d.density = 0.45 * (surface.getWidth() * widthRatio) * (d.density  / this._maxDensity);
            });

            let area0 = d3.svg.area<KdePoint>()
                .y(d => yScale(d.value))
                .x0(d => centre - d.density / 100)
                .x1(d => centre + d.density / 100);

            let area = d3.svg.area<KdePoint>()
               .y(d => yScale(d.value))
               .x0(d => centre - d.density)
               .x1(d => centre + d.density);
           
            let violin = surface.svg.append("g")
                 .append("path")
                 .datum(this._densities)
                 .attr("d", area0)
                 .style("fill", this._fill || this._defaultFill);

            violin.transition()
                 .duration(this._delay)
                 .attr("d", area);

            let tooltipLines: Array<string> = [];
            context.getSlicedColumns().forEach((column) => {
                tooltipLines.push(column + ": " + context.getSlicedColumnValue(column));
            });
            if (tooltipLines.length > 0) {
                context.getTooltip().addOn(violin, () => {
                    return tooltipLines.join("<br/>");
                });
            }
        }
    }
}
