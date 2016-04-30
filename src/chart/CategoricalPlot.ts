/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.chart {
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    import VerticalViolin = semio.shape.VerticalViolin;
    
    export class CategoricalPlot implements Plotable {        
        private _valueColumn: string;
        private _splitOnColumn: string;
        
        private _numericAccessor: (d: any) => number;
        private _categoricalAccessor: (d: any) => string;
        
        private _plotables: Array<Plotable> = [];

        value(column: string): CategoricalPlot {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        } 
        
        splitOn(column: string): CategoricalPlot {
            this._splitOnColumn = column;
            this._categoricalAccessor = function (d) {
                return d[column].toString();
            };
            return this;
        } 
        
        getCategoricalColumns(): Array<string> {
            let columns = _.flatMap(this._plotables, (p) => p.getCategoricalColumns());
            columns.push(this._splitOnColumn);
            return columns;
        }
        
        getNumericColumns(): Array<string> {
            if (this._splitOnColumn) {
                return [this._splitOnColumn];
            }
            return [];
        }
        
        add(plotable: Plotable): Plotable {
            this._plotables.push(plotable);
            return this;
        }
        
        plot(data: Array<any>, surface: Surface, context: Context): void {
            
        }
    }
}