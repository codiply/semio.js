/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>
/// <reference path="../shape/VerticalViolin.ts"/>

module semio.chart {
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;
    import VerticalViolin = semio.shape.VerticalViolin;
    
    export class ViolinPlot implements Plotable {
        
        private _valueColumn: string;
        private _splitOnColumn: string;
        
        private _numericAccessor: (d: any) => number;
        private _categoricalAccessor: (d: any) => string;
        
        value(column: string): ViolinPlot {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        } 
        
        splitOn(column: string): ViolinPlot {
            this._splitOnColumn = column;
            this._categoricalAccessor = function (d) {
                return d[column].toString();
            };
            return this;
        } 
        
        getCategoricalColumns(): Array<string> {
            return [];
        }
        
        getNumericColumns(): Array<string> {
            if (this._valueColumn) {
                return [this._valueColumn];
            }
            return [];
        }
        
        add(plotable: Plotable): Plotable {
            // Do nothing as this does not support nesting at the moment.
            return this;
        }
        
        plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data)
                return;
            
            var yScale = context.getYScale(this._valueColumn);
            var category = context.getSlicedColumns()[this._splitOnColumn];
            var categoryColor = context.getCategoryColours()[this._splitOnColumn](category);
            
            let violin = new VerticalViolin(data);
                violin.cx(surface.getWidth() / 2)
                    .yScale(yScale)
                    .yAccessor(this._numericAccessor)
                    .width(0.9 * surface.getWidth())
                    .cut(1)
                    .fill(categoryColor);
            violin.draw(surface.svg);
        }
    }
}