/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.shape {
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;
    
    interface SwarmPoint {
        x: number,
        y: number,
        color: string
    }
    
    export class VerticalSwarm {        
        private _valueColumn: string;
        private _colorColumn: string;
        private _numericAccessor: (d: any) => number;        
        private _diameter: number;
                
        value(column: string): VerticalSwarm {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        } 
        
        color(column: string): VerticalSwarm {
            this._colorColumn = column;
            return this;
        } 
        
        diameter(d: number): VerticalSwarm {
            this._diameter = d;
            return this;
        }
        
        draw(data: Array<any>, surface: Surface, context: Context): void {
            let cx = surface.getWidth() / 2;

            var yScale = context.getYScale(this._valueColumn);            
            let colors = context.getCategoryColours()[this._colorColumn];
            
            let swarmPoints: Array<SwarmPoint> = _.chain(data).map((d) => {
                return {
                    x: cx,
                    y: yScale(this._numericAccessor(d)),
                    color: colors(d[this._colorColumn])
                }
            }).orderBy((p) => p.y).value();
            
            surface.svg.append('g')
                .selectAll('circle')
                .data(swarmPoints)
                .enter()
                .append('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('r', this._diameter / 2)
                .style('fill', d => d.color);
        }
    }
}