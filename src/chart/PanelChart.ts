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

    export class PanelChart implements Plotable {        
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
        
        getCategoryColumns(): Array<string> {
            // TODO: get the columns from nested plotables.
            //       You will need to refactor the API, because you don't know the nested plotables until plot is called.
            return [];
        }
        
        plot(data: Array<any>, plotables: Array<Plotable>, surface: Surface, environment: Environment): void {
            if (plotables) {
                let topPlotable = plotables[0];
                let restPlotables = plotables.slice(0);
                
               topPlotable.getCategoryColumns().forEach((column) => {
                    let values = d3.set(data.map(function(d) { return d[column]; })).values();
                    environment.setCategoryValues(column, values); 
                    var color = d3.scale.category20().domain(values);
                    environment.setCategoryColours(column, color);
                });
                
                let groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
                let categories = groupedData.map((g) => g.key);
            
                let subSurfaces = surface.splitRows(categories.length); 
                
                categories.forEach((cat, i) => {
                    topPlotable.plot(groupedData[i].values, restPlotables, subSurfaces[i], environment);
                });
            }
        }
    }
}