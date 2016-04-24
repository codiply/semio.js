/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>

namespace semio.chart {
    import DrawingSurface = semio.core.DrawingSurface;
    import Environment = semio.interfaces.Environment;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;

    export class PanelChart {        
        private width: number;
        private height: number;
        private maxColumns: number;
        private categoricalAccessor: (d: any) => string;
        private plotable: Plotable
        
        constructor() { }
        
        setWidth(width: number): PanelChart {
            this.width = width;
            return this;
        }
        
        setHeight(height: number): PanelChart {
            this.height = height;
            return this;
        }
        
        setMaxColumns(maxColumns: number): PanelChart {
            this.maxColumns = maxColumns;
            return this;
        }
        
        splitOn(column: string): PanelChart {
            this.categoricalAccessor = function (d) {
                return d[column].toString();
            };
            return this;
        } 
        
        plot(containerId: string, data: Array<any>, plotable: Plotable): void {
            var surface = new DrawingSurface(containerId)
                .setWidth(this.width)
                .setHeight(this.height);
                
            let groupedData = d3.nest().key(this.categoricalAccessor).entries(data);
           
            _.forOwn(groupedData, (group) => {
                // TODO: Arrange svg's in a grid.
                //let childSvg = svg.append('svg');
                //this.plotable.plot(childSvg, group.values);
            });
        }
    }
}