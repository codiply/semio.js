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

    export class SmallMultiple implements Plotable {        
        private _width: number;
        private _height: number;
        private _maxColumns: number;
        private _categoricalAccessor: (d: any) => string;
        private _plotable: Plotable
        
        constructor() { }
        
        width(width: number): SmallMultiple {
            this._width = width;
            return this;
        }
        
        height(height: number): SmallMultiple {
            this._height = height;
            return this;
        }
        
        maxColumns(maxColumns: number): SmallMultiple {
            this._maxColumns = maxColumns;
            return this;
        }
        
        splitOn(column: string): SmallMultiple {
            this._categoricalAccessor = function (d) {
                return d[column].toString();
            };
            return this;
        }
        
        getCategoryColumns(): Array<string> {
            // TODO: get the columns from nested plotables.
            return [];
        }
        
        add(plotable: Plotable): Plotable {
            this._plotable = plotable;
            return this;
        }
        
        plot(data: Array<any>, surface: Surface, environment: Environment): void {
            if (!this._plotable)
                return;
                
            this._plotable.getCategoryColumns().forEach((column) => {
                let values = d3.set(data.map(function(d) { return d[column]; })).values();
                environment.setCategoryValues(column, values); 
                var color = d3.scale.category20().domain(values);
                environment.setCategoryColours(column, color);
            });
            
            let groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
            let categories = groupedData.map((g) => g.key);
        
            let subSurfaces = surface.splitRows(categories.length); 
            
            categories.forEach((cat, i) => {
                this._plotable.plot(groupedData[i].values, subSurfaces[i], environment);
            });
        }
    }
}