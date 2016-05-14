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
    
    const SCALE_METHOD_WIDTH = 'width';
    const SCALE_METHOD_COUNT = 'count';
    
    export class ViolinPlot implements CategoricalPlotable {
        
        private _valueColumn: string;
        private _splitOnColumn: string;
        
        private _numericAccessor: (d: any) => number;
        private _categoricalAccessor: (d: any) => string;
        
        private _scaleMethod: string = SCALE_METHOD_COUNT;
        private _extend: number = 1;
        
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
        
        scale(method: string): ViolinPlot {
            if (method.toLowerCase() === SCALE_METHOD_WIDTH) {
                this._scaleMethod = SCALE_METHOD_WIDTH;
            }
            return this;
        }
        
        extend(extend: number): ViolinPlot {
            this._extend = extend;
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
                            .extend(this._extend)
                            .fill(categoryColor);
                        violin.preDraw(group.values);
                        violin.draw(subSurface, context);
                    }
                });      
            } else {
                let violin = new VerticalViolin();
                violin.value(this._valueColumn).extend(this._extend);
                violin.preDraw(data);
                violin.draw(surface, context);
            }
        }
    }
}