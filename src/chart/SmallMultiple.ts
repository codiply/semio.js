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
        private _betweenMarginRatioRight = 0.05;
        private _betweenMarginRatioTop = 0.05;
        private _width: number;
        private _height: number;
        private _maxColumns: number;
        private _splitOnColumn: string;
        private _categoricalAccessor: (d: any) => string;
        private _plotable: Plotable;
        
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
        
        headerRatio(ratio: number): SmallMultiple {
            this._headerRatio = ratio;
            return this;
        }
        
        beetweenMarginRatioRight(ratio: number): SmallMultiple {
            this._betweenMarginRatioRight = ratio;
            return this;
        }
        
        betweenMarginRatioTop(ratio: number): SmallMultiple {
            this._betweenMarginRatioTop = ratio;
            return this;
        }
        
        getCategoryColumns(): Array<string> {
            return this._plotable.getCategoryColumns();
        }
        
        
        getNumericColumns(): Array<string> {
            return this._plotable.getNumericColumns();
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
        
            let subSurfaces = surface.splitGrid(categories.length, 
                this._maxColumns, this._betweenMarginRatioTop, this._betweenMarginRatioRight); 
            
            // TODO: set the colours for the categorical value if not already set.
            let updatedEnvironment = this.setNumericRanges(data, environment);
            
            categories.forEach((cat, i) => {
                let splitSurface = subSurfaces[i].splitHeader(this._headerRatio);
                
                let title = this._splitOnColumn + ': ' + cat;
                Text.placeTitle(splitSurface.header, title);
                
                this._plotable.plot(groupedData[i].values, splitSurface.body, updatedEnvironment.setSlicedColumn(this._splitOnColumn, cat));
            });
        }
        
        private setNumericRanges(data: Array<any>, environment: Environment): Environment {
            let newEnvironment = environment;
            this._plotable.getNumericColumns().forEach((col) => {
                if (!environment.getNumericRange(col)) {
                    let extent = d3.extent(data, d => +d[col]);
                    newEnvironment = newEnvironment.setNumericRange(col, extent);
                }
            })
            return newEnvironment;
        }
    }
}