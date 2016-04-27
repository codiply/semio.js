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
        
        constructor(private containerId: string) { }
        
        width(width: number): Visualization {
            this._width = width;
            return this;
        }
        
        height(height: number): Visualization {
            this._height = height;
            return this;
        }
        
        plot(data: Array<any>, plotables: Array<Plotable>): void {
            var surface = new DrawingSurface(this.containerId)
                .setWidth(this._width)
                .setHeight(this._height);
            
            if (!plotables)
                return;
            
            // Nest the plotables
            for (let i = 0; i < plotables.length - 1; i++) {
                let parent = plotables[i];
                let child = plotables[i + 1];
                parent.add(child);
            }
            let topPlotable = plotables[0];
            let environment = new PlotEnvironment();
            topPlotable.plot(data, surface, environment);
        }
    }
}