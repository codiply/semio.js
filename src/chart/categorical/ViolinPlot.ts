/// <reference path="../../../typings/d3/d3.d.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>
/// <reference path="../../interfaces/CategoricalPlotable.ts"/>
/// <reference path="../../interfaces/Context.ts"/>
/// <reference path="../../interfaces/Surface.ts"/>
/// <reference path="../../shape/VerticalViolin.ts"/>

module semio.chart.categorical {
    import CategoricalPlotable = semio.interfaces.CategoricalPlotable;
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;
    import VerticalViolin = semio.shape.VerticalViolin;
    
    export class ViolinPlot implements CategoricalPlotable {
        
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
        
        plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data)
                return;
            
            var yScale = context.getYScale(this._valueColumn);
            
            if (this._splitOnColumn) {
                var xScale = context.getXScale(this._splitOnColumn);
                var categories = context.getCategoryValues(this._splitOnColumn);
                
                var categoryWidth = surface.getWidth() / categories.length;
                
                let groupedData = d3.nest().key(this._categoricalAccessor).entries(data);

                _.forOwn(groupedData, (group) => {
                    if (group.values) {
                        var category = group.key;
                        var categoryColor = context.getCategoryColours(this._splitOnColumn)(category);                 
                        
                        let subSurface = surface
                            .addCenteredColumn('_violin_' + category, xScale(category), categoryWidth);
                        
                        let updatedContext = context.setSlicedColumnValue(this._splitOnColumn, category);
                        
                        let violin = new VerticalViolin();
                        violin.value(this._valueColumn)
                            .cut(1)
                            .fill(categoryColor);
                        violin.preDraw(group.values);
                        violin.draw(subSurface, context);
                    }
                });      
            } else {
                let violin = new VerticalViolin();
                violin.value(this._valueColumn)
                    .cut(1);
                violin.preDraw(data);
                violin.draw(surface, context);
            }
        }
    }
}