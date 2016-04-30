/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>

module semio.core {
    import Context = semio.interfaces.Context;
    
    export class PlotContext implements Context {
        private _categoryColours: { [column: string]: (value: string) => string } = { };
        private _categoryValues: { [column: string]: Array<string> } = { };
        private _numericRange: { [column: string]: [number, number] } = { };
        private _slicedColumns: { [column: string]: string } = { };
        private _yScale: { [column: string]: (value: d3.Primitive) => number } = { };
        private _xScale: { [column: string]: (value: d3.Primitive) => number } = { };
        
        setCategoryValues(column: string, values: Array<string>): Context {
            let clone = this.clone();
            clone._categoryValues[column] = values.slice(0);
            return clone;
        }
        
        setCategoryColours(column: string, colours: (value: string) => string): Context {
            let clone = this.clone();
            clone._categoryColours[column] = colours;
            return clone;
        }
        
        setNumericRange(column:string, range: [number, number]): Context {
            let clone = this.clone();
            clone._numericRange[column] = range;
            return this;
        }
        
        setSlicedColumn(column: string, value: string): Context {
            let clone = this.clone();
            clone._slicedColumns[column] = value;
            return this;
        }
        
        setXScale(column: string, scale: (value: d3.Primitive) => number): Context {
            this._xScale[column] = scale;
            return this;
        }
        
        setYScale(column: string, scale: (value: d3.Primitive) => number): Context {
           this._yScale[column] = scale;
           return this;   
        }
        
        getCategoryValues(): { [column: string]: Array<string>} {            
            return this._categoryValues;
        }
        
        getCategoryColours(): { [column: string]: (value: string) => string } {
            return this._categoryColours;
        }
        
        getNumericRange(column: string): [number, number] {
            return this._numericRange[column];
        }
        
        getSlicedColumns(): { [column: string]: string} {
            return this._slicedColumns;
        }
        
        getXScale(column: string): (value: d3.Primitive) => number {
            return this._xScale[column];
        }
        
        getYScale(column: string): (value: d3.Primitive) => number {
            return this._yScale[column];
        }
        
        private clone(): PlotContext {
            let clone = new PlotContext();
            clone._categoryColours = _.clone(this._categoryColours);
            clone._categoryValues = _.clone(this._categoryValues);
            clone._numericRange = _.clone(this._numericRange);
            clone._slicedColumns = _.clone(this._slicedColumns);
            clone._yScale = _.clone(this._yScale);
            clone._xScale = _.clone(this._xScale);
            return this;
        }
    }
}