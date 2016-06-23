/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

namespace semio.chart {
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;

    export class SankeyDiagram implements Plotable {
        private _sourceColumn: string;
        private _targetColumn: string;
        private _valueColumn: string;

        public sourceColumn(column: string): SankeyDiagram {
            this._sourceColumn = column;
            return this;
        }

        public targetColumn(column: string): SankeyDiagram {
            this._targetColumn = column;
            return this;
        }

        public valueColumn(column: string): SankeyDiagram {
            this._valueColumn = column;
            return this;
        }

        public getCategoricalColumns(): Array<string> {
            return [];
        }

        public getNumericColumns(): Array<string> {
            return [];
        }

        public plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data) {
                return;
            }
        }
    }
}
