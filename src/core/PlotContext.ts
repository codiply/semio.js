/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Tooltip.ts"/>

module semio.core {
    import Context = semio.interfaces.Context;
    import Tooltip = semio.interfaces.Tooltip;
    
    export class PlotContext implements Context {
        private _categoryColours: { [column: string]: (value: string) => string } = { };
        private _categoryValues: { [column: string]: Array<string> } = { };
        private _numericRange: { [column: string]: [number, number] } = { };
        private _slicedColumns: { [column: string]: string } = { };
        private _yScale: { [column: string]: (value: d3.Primitive) => number } = { };
        private _xScale: { [column: string]: (value: d3.Primitive) => number } = { };
        private _tooltip: Tooltip;
        
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
            return clone;
        }
        
        setSlicedColumnValue(column: string, value: string): Context {
            let clone = this.clone();
            clone._slicedColumns[column] = value;
            return clone;
        }
        
        setXScale(column: string, scale: (value: d3.Primitive) => number): Context {
            let clone = this.clone();
            clone._xScale[column] = scale;
            return clone;
        }
        
        setYScale(column: string, scale: (value: d3.Primitive) => number): Context {
           let clone = this.clone();
           clone._yScale[column] = scale;
           return clone;   
        }
        
        setTooltip(tooltip: Tooltip): Context {
            let clone = this.clone();
            clone._tooltip = tooltip;
            return clone;
        }
        
        getCategoryValues(column: string): Array<string> {            
            return this._categoryValues[column];
        }
        
        getCategoryColours(column: string): (value: string) => string {
            return this._categoryColours[column];
        }
        
        getNumericRange(column: string): [number, number] {
            return this._numericRange[column];
        }
        
        getSlicedColumns(): Array<string> {
            return _.keys(this._slicedColumns);
        }
        
        getSlicedColumnValue(column: string): string {
            return this._slicedColumns[column];
        }
        
        getXScale(column: string): (value: d3.Primitive) => number {
            return this._xScale[column];
        }
        
        getYScale(column: string): (value: d3.Primitive) => number {
            return this._yScale[column];
        }
        
        getTooltip(): Tooltip {
            return this._tooltip;
        }
        
        private clone(): PlotContext {
            let clone = new PlotContext();
            clone._categoryColours = _.clone(this._categoryColours);
            clone._categoryValues = _.clone(this._categoryValues);
            clone._numericRange = _.clone(this._numericRange);
            clone._slicedColumns = _.clone(this._slicedColumns);
            clone._yScale = _.clone(this._yScale);
            clone._xScale = _.clone(this._xScale);
            clone._tooltip = this._tooltip;
            return this;
        }
    }
}