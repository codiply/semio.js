/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../core/DrawingSurface.ts"/>
/// <reference path="../core/PlotEnvironment.ts"/>
/// <reference path="../interfaces/Environment.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>
/// <reference path="../shape/Text.ts"/>

namespace semio.chart {
    import DrawingSurface = semio.core.DrawingSurface;
    import PlotEnvironment = semio.core.PlotEnvironment;
    import Environment = semio.interfaces.Environment;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    import Text = semio.shape.Text;

    export class SmallMultiple implements Plotable {
        private _headerRatio: number = 0.1;     
        private _width: number;
        private _height: number;
        private _maxColumns: number;
        private _splitOnColumn: string;
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
            this._splitOnColumn = column;
            return this;
        }
        
        headerRation(ratio: number): SmallMultiple {
            this._headerRatio = ratio;
            return this;
        }
        
        getCategoryColumns(): Array<string> {
            return this._plotable.getCategoryColumns();
        }
        
        add(plotable: Plotable): Plotable {
            this._plotable = plotable;
            return this;
        }
        
        plot(data: Array<any>, surface: Surface, environment: Environment): void {
            if (!this._plotable)
                return;
            
            let groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
            let categories = groupedData.map((g) => g.key);
        
            let subSurfaces = surface.splitGrid(categories.length, this._maxColumns); 
            
            categories.forEach((cat, i) => {
                let splitSurface = subSurfaces[i].splitHeader(this._headerRatio);
                
                let title = this._splitOnColumn + ': ' + cat;
                Text.placeTitle(splitSurface.header, title);
                
                this._plotable.plot(groupedData[i].values, splitSurface.body, environment);
            });
        }
    }
}