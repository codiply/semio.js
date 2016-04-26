/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../core/DrawingSurface.ts"/>
/// <reference path="../core/PlotEnvironment.ts"/>
/// <reference path="../interfaces/Environment.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

namespace semio.chart {
    import DrawingSurface = semio.core.DrawingSurface;
    import PlotEnvironment = semio.core.PlotEnvironment;
    import Environment = semio.interfaces.Environment;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;

    export class PanelChart {        
        private _width: number;
        private _height: number;
        private _maxColumns: number;
        private _categoricalAccessor: (d: any) => string;
        private _plotable: Plotable
        
        constructor() { }
        
        width(width: number): PanelChart {
            this._width = width;
            return this;
        }
        
        height(height: number): PanelChart {
            this._height = height;
            return this;
        }
        
        maxColumns(maxColumns: number): PanelChart {
            this._maxColumns = maxColumns;
            return this;
        }
        
        splitOn(column: string): PanelChart {
            this._categoricalAccessor = function (d) {
                return d[column].toString();
            };
            return this;
        }
        
        plot(containerId: string, plotable: Plotable, data: Array<any>): void {
            var surface = new DrawingSurface(containerId)
                .setWidth(this._width)
                .setHeight(this._height);
                
            let environment = new PlotEnvironment();
            plotable.getCategoryColumns().forEach((column) => {
                let values = d3.set(data.map(function(d) { return d[column]; })).values();
                environment.setCategoryValues(column, values); 
                var color = d3.scale.category20().domain(values);
                environment.setCategoryColours(column, color);
            });
               
            let groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
            let categories = groupedData.map((g) => g.key);
           
            let subSurfaces = surface.splitRows(categories.length); 
            
            categories.forEach((cat, i) => {
                plotable.plot(subSurfaces[i], environment, groupedData[i].values);
            });
        }
    }
}