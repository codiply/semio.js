/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.core {
    import Surface = semio.interfaces.Surface;
    
    export class DrawingSurface implements Surface {
        private width: number;
        private height: number;
        private x: number;
        private y: number;
        
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
        
        setX(x: number): Surface {
            this.x = x;
            this.svg.attr('x', x);
            return this;
        }
        
        setY(y: number): Surface {
            this.y = y;
            this.svg.attr('y', y);
            return this;
        }
        
        getWidth(): number { return this.width; }
        getHeight(): number { return this.height; }
        
        splitRows(n: number): Array<Surface> {
            let rowHeight = this.height / n;
            return _.range(0, n).map((row) => {
                return new DrawingSurface(this.containerId + '_row_' + row.toString())
                    .setHeight(rowHeight)
                    .setWidth(this.width)
                    .setY(row * rowHeight); 
            });
        }
        
        splitColumns(n: number): Array<Surface> {
            let columnWidth = this.width / n;
            return _.range(0, n).map((col) => {
                return new DrawingSurface(this.containerId + '_column_' + col.toString())
                    .setHeight(this.height)
                    .setWidth(columnWidth)
                    .setX(col * columnWidth);
            });
        }
        
        splitGrid(n: number, maxColumns: number): Array<Array<Surface>> {
            let nColumns = Math.min(n, maxColumns);
            let nRows = Math.ceil(n / nColumns);
            
            let cellWidth = this.width / nColumns;
            let cellHeight = this.height / nRows;
            
            return _.range(0, nRows).map((row) => {
                return _.range(0, nColumns).filter((col) => {
                    let i = row * nColumns + col;
                    return i < n; 
                }).map((col) => {
                    return new DrawingSurface(this.containerId + '_row_' + row.toString() + '_column_' + col.toString())
                        .setHeight(cellHeight)
                        .setWidth(cellHeight)
                        .setX(col * cellHeight)
                        .setY(row * cellHeight);
                });
            });
        }
    }
}