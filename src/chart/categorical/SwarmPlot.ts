/// <reference path="../../../typings/d3/d3.d.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>
/// <reference path="../../interfaces/CategoricalPlotable.ts"/>
/// <reference path="../../interfaces/Context.ts"/>
/// <reference path="../../interfaces/Surface.ts"/>

module semio.chart.categorical {
    import CategoricalPlotable = semio.interfaces.CategoricalPlotable;
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;
    
    export class SwarmPlot implements CategoricalPlotable {
        private _valueColumn: string;
        private _splitOnColumn: string;
        private _colorColumn: string;
        private _idColumn: string;
        private _numericAccessor: (d: any) => number;
        private _categoricalAccessor: (d: any) => string;
        private _diameter: number = 5;

        value(column: string): SwarmPlot {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        }
        
        splitOn(column: string): SwarmPlot {
            this._splitOnColumn = column;
            this._categoricalAccessor = function (d) {
                return d[column].toString();
            };
            return this;
        } 
        
        color(column: string): SwarmPlot {
            this._colorColumn = column;
            return this;
        } 
        
        id(column: string): SwarmPlot {
            this._idColumn = column;
            return this;
        }
        
        diameter(d: number): SwarmPlot {
            this._diameter = d;
            return this;
        }
        
        getCategoricalColumns(): Array<string> {
            if (this._colorColumn) {
                return [this._colorColumn];
            }
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
            var xScale = context.getXScale(this._splitOnColumn);
            var categories = context.getCategoryValues(this._splitOnColumn);
            
            var categoryWidth = surface.getWidth() / categories.length;
            
            let groupedData = d3.nest().key(this._categoricalAccessor).entries(data);

            _.forOwn(groupedData, (group) => {
                if (group.values) {
                    var category = group.key;                
                    
                    let subSurface = surface
                        .addCenteredColumn('_swarm_' + category, xScale(category), categoryWidth);
                    
                    let swarm = new semio.shape.VerticalSwarm()
                        .color(this._colorColumn)
                        .value(this._valueColumn)
                        .diameter(this._diameter)
                        .id(this._idColumn);
            
                    swarm.draw(group.values, subSurface, context);
                }
            });
        }
    }
}