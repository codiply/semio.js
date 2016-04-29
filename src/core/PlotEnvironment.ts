/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Environment.ts"/>

module semio.core {
    import Environment = semio.interfaces.Environment;
    
    export class PlotEnvironment implements Environment {
        private _categoryColours: { [column: string]: (value: string) => string } = { };
        private _categoryValues: { [column: string]: Array<string> } = { };
        private _numericRange: { [column: string]: [number, number] } = { };
        private _slicedColumns: { [column: string]: string } = { };
        
        setCategoryValues(column: string, values: Array<string>): Environment {
            let clone = this.clone();
            clone._categoryValues[column] = values.slice(0);
            return clone;
        }
        
        setCategoryColours(column: string, colours: (value: string) => string): Environment {
            let clone = this.clone();
            clone._categoryColours[column] = colours;
            return clone;
        }
        
        setNumericRange(column:string, range: [number, number]): Environment {
            let clone = this.clone();
            clone._numericRange[column] = range;
            return this;
        }
        
        setSlicedColumn(column: string, value: string): Environment {
            let clone = this.clone();
            clone._slicedColumns[column] = value;
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
        
        private clone(): PlotEnvironment {
            let clone = new PlotEnvironment();
            clone._categoryColours = _.clone(this._categoryColours);
            clone._categoryValues = _.clone(this._categoryValues);
            clone._numericRange = _.clone(this._numericRange);
            clone._slicedColumns = _.clone(this._slicedColumns);
            return this;
        }
    }
}