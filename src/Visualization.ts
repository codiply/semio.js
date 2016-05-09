/// <reference path="../typings/d3/d3.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>
/// <reference path="core/ColorPalette.ts"/>
/// <reference path="core/DrawingSurface.ts"/>
/// <reference path="core/PlotContext.ts"/>
/// <reference path="core/PlotTooltip.ts"/>
/// <reference path="interfaces/Context.ts"/>
/// <reference path="interfaces/Plotable.ts"/>

namespace semio {
    import ColorPalette = semio.core.ColorPalette;
    import DrawingSurface = semio.core.DrawingSurface;
    import PlotContext = semio.core.PlotContext;
    import PlotTooltip = semio.core.PlotTooltip;
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;

    export class Visualization {        
        private _width: number = 800;
        private _height: number = 800;
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
            if (!data || !this._plotable)
                return;
            
            var surface = new DrawingSurface(this.containerId)
                .setWidth(this._width)
                .setHeight(this._height);
           
            let context: Context = new PlotContext();
            
            let tooltip = new PlotTooltip(this.containerId);
            context = context.setTooltip(tooltip);
            
            this._plotable.getCategoricalColumns().forEach((column) => {
                let values = d3.set(data.map(function(d) { return d[column]; })).values();
                context = context.setCategoryValues(column, values); 
                
                var colors = ColorPalette.qualitative(values);
                context = context.setCategoryColours(column, colors);
            });            
            
            this._plotable.plot(data, surface, context);
        }
    }
}