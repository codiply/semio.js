/// <reference path="../typings/d3/d3.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>
/// <reference path="core/DrawingSurface.ts"/>
/// <reference path="core/PlotEnvironment.ts"/>
/// <reference path="interfaces/Plotable.ts"/>

namespace semio.chart {
    import DrawingSurface = semio.core.DrawingSurface;
    import PlotEnvironment = semio.core.PlotEnvironment;
    import Plotable = semio.interfaces.Plotable;

    export class Visualization {        
        private _width: number;
        private _height: number;
        
        constructor() { }
        
        width(width: number): Visualization {
            this._width = width;
            return this;
        }
        
        height(height: number): Visualization {
            this._height = height;
            return this;
        }
        
        plot(containerId: string, plotable: Plotable, data: Array<any>): void {
            var surface = new DrawingSurface(containerId)
                .setWidth(this._width)
                .setHeight(this._height);
                
            let environment = new PlotEnvironment();
            
            plotable.plot(surface, environment, data);
        }
    }
}