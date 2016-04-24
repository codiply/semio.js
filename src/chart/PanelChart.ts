/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../core/DrawingSurface.ts"/>
/// <reference path="../interfaces/Environment.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

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
            let categories = groupedData.map((g) => g.key);
            
            let subSurfaces = surface.splitRows(categories.length);
            
            categories.forEach((cat, i) => {
                plotable.plot(subSurfaces[i], null, groupedData[i].values);
            });
        }
    }
}