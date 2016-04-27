/// <reference path="../typings/d3/d3.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>
/// <reference path="core/DrawingSurface.ts"/>
/// <reference path="core/PlotEnvironment.ts"/>
/// <reference path="interfaces/Plotable.ts"/>

namespace semio {
    import DrawingSurface = semio.core.DrawingSurface;
    import PlotEnvironment = semio.core.PlotEnvironment;
    import Plotable = semio.interfaces.Plotable;

    export class Visualization {        
        private _width: number;
        private _height: number;
        private _plotable: Plotable;
        
        constructor(private containerId: string) { }
        
        width(width: number): Visualization {
            this._width = width;
            return this;
        }
        
        height(height: number): Visualization {
            this._height = height;
            return this;
        }
        
        add(plotable: Plotable): Visualization {
            this._plotable = plotable;
            return this;
        }
        
        plot(data: Array<any>): void {
            var surface = new DrawingSurface(this.containerId)
                .setWidth(this._width)
                .setHeight(this._height);
                
            let environment = new PlotEnvironment();
            
            this._plotable.plot(surface, environment, data);
        }
    }
}