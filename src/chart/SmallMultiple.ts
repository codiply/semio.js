/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../core/DrawingSurface.ts"/>
/// <reference path="../core/PlotContext.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>
/// <reference path="../shape/Text.ts"/>

namespace semio.chart {
    import DrawingSurface = semio.core.DrawingSurface;
    import PlotContext = semio.core.PlotContext;
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    import Text = semio.shape.Text;

    export class SmallMultiple implements Plotable {
        private _headerRatio: number = 0.1;    
        private _horizontalSpacingRatio = 0.05;
        private _verticalSpacingRatio = 0.05;
        private _maxColumns: number;
        private _splitOnColumn: string;
        private _categoricalAccessor: (d: any) => string;
        private _plotable: Plotable;
        
        constructor() { }
        
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
        
        horizontalSpacingRatio(ratio: number): SmallMultiple {
            this._horizontalSpacingRatio = ratio;
            return this;
        }
        
        verticalSpacingRatio(ratio: number): SmallMultiple {
            this._verticalSpacingRatio = ratio;
            return this;
        }
        
        getCategoricalColumns(): Array<string> {
            let columns = this._plotable.getCategoricalColumns().slice(0);
            columns.push(this._splitOnColumn);
            return columns;
        }
        
        getNumericColumns(): Array<string> {
            return this._plotable.getNumericColumns().slice(0);
        }
        
        add(plotable: Plotable): Plotable {
            this._plotable = plotable;
            return this;
        }
        
        plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data || !this._plotable)
                return;
            
            let groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
            let categories = groupedData.map((g) => g.key);
        
            let subSurfaces = surface.splitGrid(categories.length, 
                this._maxColumns, this._horizontalSpacingRatio, this._verticalSpacingRatio); 
            
            let updatedContext = this.fixNumericRanges(data, context);
            
            categories.forEach((cat, i) => {
                let splitSurface = subSurfaces[i].splitHeader(this._headerRatio);
                
                let title = this._splitOnColumn + ': ' + cat;
                Text.placeTitle(splitSurface.header, title);
                
                let updatedContextWithSlice = updatedContext.setSlicedColumn(this._splitOnColumn, cat);
                this._plotable.plot(groupedData[i].values, splitSurface.body, updatedContextWithSlice);
            });
        }
        
        private fixNumericRanges(data: Array<any>, context: Context): Context {
            let newContext = context;
            this._plotable.getNumericColumns().forEach((col) => {
                if (!context.getNumericRange(col)) {
                    let extent = d3.extent(data, d => +d[col]);
                    newContext = newContext.setNumericRange(col, extent);
                }
            })
            return newContext;
        }
    }
}