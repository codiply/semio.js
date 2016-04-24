/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.core {
    import Surface = semio.interfaces.Surface;
    
    export class DrawingSurface implements Surface {
        private width: number;
        private height: number;
        private isSplit: number;
        
        svg: d3.Selection<any>;
        
        constructor(private containerId: string) { 
            this.svg = d3.select('#' + containerId)
                         .append('svg');
        }
        
        setWidth(width: number): Surface {
            this.width = width;
            this.svg.attr('width', width);
            return this;
        }
        
        setHeight(height: number): Surface {
            this.height = height;
            this.svg.attr('height', height);
            return this;
        }
        
        getWidth(): number { return this.width; }
        getHeight(): number { return this.height; }
        
        splitRows(n: number): Array<Surface> {

            return [];
        }
        splitColumns(n: number): Array<Surface> {
            return [];
        }
        splitGrid(n: number): Array<Surface> {
            return [];
        }
    }
}