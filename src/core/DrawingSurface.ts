/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.core {
    import Surface = semio.interfaces.Surface;
    
    export class DrawingSurface implements Surface {
        private _width: number;
        private _height: number;
        private _x: number;
        private _y: number;
        
        svg: d3.Selection<any>;
        
        constructor(private containerId: string) { 
            this.svg = d3.select('#' + containerId)
                         .append('svg');
        }
        
        setWidth(width: number): Surface {
            this._width = width;
            this.svg.attr('width', width);
            return this;
        }
        
        setHeight(height: number): Surface {
            this._height = height;
            this.svg.attr('height', height);
            return this;
        }
        
        setX(x: number): Surface {
            this._x = x;
            this.svg.attr('x', x);
            return this;
        }
        
        setY(y: number): Surface {
            this._y = y;
            this.svg.attr('y', y);
            return this;
        }
        
        getWidth(): number { return this._width; }
        getHeight(): number { return this._height; }
        
        splitRows(n: number): Array<Surface> {
            let rowHeight = this._height / n;
            return _.range(0, n).map((row) => {
                let id = this.containerId + '_row_' + row.toString();
                this.svg.append('g').attr('id', id);
                return new DrawingSurface(id)
                    .setHeight(rowHeight)
                    .setWidth(this._width)
                    .setY(row * rowHeight); 
            });
        }
        
        splitColumns(n: number): Array<Surface> {
            let columnWidth = this._width / n;
            return _.range(0, n).map((col) => {
                let id = this.containerId + '_column_' + col.toString()
                this.svg.append('g').attr('id', id);
                return new DrawingSurface(id)
                    .setHeight(this._height)
                    .setWidth(columnWidth)
                    .setX(col * columnWidth);
            });
        }
        
        splitGrid(n: number, maxColumns: number): Array<Array<Surface>> {
            let nColumns = Math.min(n, maxColumns);
            let nRows = Math.ceil(n / nColumns);
            
            let cellWidth = this._width / nColumns;
            let cellHeight = this._height / nRows;
            
            return _.range(0, nRows).map((row) => {
                return _.range(0, nColumns).filter((col) => {
                    let i = row * nColumns + col;
                    return i < n; 
                }).map((col) => {
                    let id = this.containerId + '_row_' + row.toString() + '_column_' + col.toString();
                    this.svg.append('g').attr('id', id);
                    return new DrawingSurface(id)
                        .setHeight(cellHeight)
                        .setWidth(cellHeight)
                        .setX(col * cellHeight)
                        .setY(row * cellHeight);
                });
            });
        }
    }
}