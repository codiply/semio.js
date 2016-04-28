/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Environment.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.chart {
    import Environment = semio.interfaces.Environment;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    import VerticalViolin = semio.shape.VerticalViolin;
    
    export class CategoricalPlot implements Plotable {
        private _xMargin: number = 0.1;
        private _yMargin: number = 0.1;
        private _splitOnColumn: string;
        private _categoricalAccessor: (d: any) => string;
        private _numericAccessor: (d: any) => number;
        private _categoryColumns: Array<string> = [];

        value(column: string): CategoricalPlot {
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        } 
        
        splitOn(column: string): CategoricalPlot {
            this._categoricalAccessor = function (d) {
                return d[column].toString();
            };
            this._splitOnColumn = column;
            this._categoryColumns.push(column);
            return this;
        } 
        
        getCategoryColumns(): Array<string> {
            return this._categoryColumns;
        }
        
        getNumericColumns(): Array<string> {
            if (this._splitOnColumn) {
                return [this._splitOnColumn];
            }
            return [];
        }
        
        add(plotable: Plotable): Plotable {
            return this;
        }
        
        plot(data: Array<any>, surface: Surface, environment: Environment): void {
            
        }
    }
}