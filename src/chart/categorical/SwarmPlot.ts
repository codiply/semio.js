/// <reference path="../../../typings/d3/d3.d.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>
/// <reference path="../../interfaces/CategoricalPlotable.ts"/>
/// <reference path="../../interfaces/Context.ts"/>
/// <reference path="../../interfaces/Surface.ts"/>
/// <reference path="../../shape/VerticalSwarm.ts"/>

module semio.chart.categorical {
    import CategoricalPlotable = semio.interfaces.CategoricalPlotable;
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;
    import VerticalSwarm = semio.shape.VerticalSwarm;

    export class SwarmPlot implements CategoricalPlotable {
        private _valueColumn: string;
        private _splitOnColumn: string;
        private _colorColumn: string;
        private _idColumn: string;
        private _numericAccessor: (d: any) => number;
        private _categoricalAccessor: (d: any) => string;
        private _diameter: number = 5;
        private _delay: number = 2000;

        public value(column: string): SwarmPlot {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        }

        public splitOn(column: string): SwarmPlot {
            this._splitOnColumn = column;
            this._categoricalAccessor = function (d) {
                return d[column].toString();
            };
            return this;
        }

        public getLegendColumn(): string {
            return this._colorColumn;
        }

        public color(column: string): SwarmPlot {
            this._colorColumn = column;
            return this;
        }

        public id(column: string): SwarmPlot {
            this._idColumn = column;
            return this;
        }

        public diameter(diameter: number): SwarmPlot {
            this._diameter = diameter;
            return this;
        }

        public delay(delay: number): SwarmPlot {
            this._delay = delay;
            return this;
        }

        public getCategoricalColumns(): Array<string> {
            if (this._colorColumn) {
                return [this._colorColumn];
            }
            return [];
        }

        public getNumericColumns(): Array<string> {
            return [];
        }

        public plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data) {
                return;
            }

            let yScale = context.getYScale(this._valueColumn);

            if (this._splitOnColumn) {
                let xScale = context.getXScale(this._splitOnColumn);
                let categories = context.getCategoryValues(this._splitOnColumn);

                let categoryWidth = surface.getWidth() / categories.length;

                let groupedData = d3.nest().key(this._categoricalAccessor).entries(data);

                _.forOwn(groupedData, (group) => {
                    if (group.values) {
                        let category = group.key;

                        let subSurface = surface
                            .addCenteredColumn("_swarm_" + category, xScale(category), categoryWidth);

                        let updatedContext = context.setSlicedColumnValue(this._splitOnColumn, category);
                        this.constructVerticalSwarm().draw(group.values, subSurface, context);
                    }
                });
            } else {
                this.constructVerticalSwarm().draw(data, surface, context);
            }
        }

        private constructVerticalSwarm(): VerticalSwarm {
            return new semio.shape.VerticalSwarm()
                .color(this._colorColumn)
                .value(this._valueColumn)
                .diameter(this._diameter)
                .delay(this._delay)
                .id(this._idColumn);
        }
    }
}
