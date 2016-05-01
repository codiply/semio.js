/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.chart {
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    
    export class SwarmPlot implements Plotable {
        private _valueColumn: string;
        private _colorColumn: string;
        private _numericAccessor: (d: any) => number;
        private _diameter: number = 5;

        value(column: string): SwarmPlot {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        } 
        
        color(column: string): SwarmPlot {
            this._colorColumn = column;
            return this;
        } 
        
        diameter(d: number): SwarmPlot {
            this._diameter = d;
            return this;
        }
        
        getCategoricalColumns(): Array<string> {
            if (this._colorColumn) {
                return [this._colorColumn];
            }
            return [];
        }
        
        getNumericColumns(): Array<string> {
            if (this._valueColumn) {
                return [this._valueColumn];
            }
            return [];
        }
        
        add(plotable: Plotable): Plotable {
            // Do nothing as this does not support nesting at the moment.
            return this;
        }
        
        plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data)
                return;
            
            let swarm = new semio.shape.VerticalSwarm()
                .color(this._colorColumn)
                .value(this._valueColumn)
                .diameter(this._diameter);
            
            swarm.draw(data, surface, context);
        }
    }
}