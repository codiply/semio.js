/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>

module semio.chart {
    import Plotable = semio.interfaces.Plotable;

    export class PanelChart implements Plotable {        
        private _width: number;
        private _height: number;
        private _maxColumns: number;
        private _categoricalAccessor: (d: any) => string;
        private _plotable: Plotable
        
        constructor() { }
        
        width(width: number): PanelChart {
            this._width = width;
            return this;
        }
        
        height(height: number): PanelChart {
            this._height = height;
            return this;
        }
        
        maxColumns(maxColumns: number): PanelChart {
            this._maxColumns = maxColumns;
            return this;
        }
        
        categorical(accessor: (d: any) => d3.Primitive): PanelChart {
            this._categoricalAccessor = function (d) {
                return accessor(d).toString();
            };
            return this;
        } 
        
        plot(svg: d3.Selection<any>, data: Array<any>): void {               
            let groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
           
            _.forOwn(groupedData, (group) => {
                // TODO: Arrange svg's in a grid.
                let childSvg = svg.append('svg');
                this._plotable.plot(childSvg, group.values);
            });
        }
    }
}