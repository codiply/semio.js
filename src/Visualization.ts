/// <reference path="../typings/d3/d3.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>
/// <reference path="core/DrawingSurface.ts"/>
/// <reference path="core/PlotEnvironment.ts"/>
/// <reference path="interfaces/Environment.ts"/>
/// <reference path="interfaces/Plotable.ts"/>

namespace semio {
    import DrawingSurface = semio.core.DrawingSurface;
    import PlotEnvironment = semio.core.PlotEnvironment;
    import Environment = semio.interfaces.Environment;
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
           
            let environment: Environment = new PlotEnvironment();
            
            // TODO: do this only if a flag is set
            this._plotable.getCategoryColumns().forEach((column) => {
                let values = d3.set(data.map(function(d) { return d[column]; })).values();
                
                environment = environment.setCategoryValues(column, values); 
                
                // TODO: Handle more than 20 colours
                var color = d3.scale.category20().domain(values);
                environment = environment.setCategoryColours(column, color);
            });            
            
            this._plotable.plot(data, surface, environment);
        }
    }
}