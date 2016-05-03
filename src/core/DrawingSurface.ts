/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.core {
    import Surface = semio.interfaces.Surface;
    import SurfaceHeaderBody = semio.interfaces.SurfaceHeaderBody;
    
    export class DrawingSurface implements Surface {
        private _width: number;
        private _height: number;
        private _x: number;
        private _y: number;
        
        svg: d3.Selection<any>;
        
        constructor(public containerId: string) { 
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
        
        splitRows(n: number, marginRatioTop: number): Array<Surface> {
            let rowHeight = this._height * (1 - marginRatioTop) / n;
            let marginHeight = this._height * marginRatioTop / (n - 1);
            return _.range(0, n).map((row) => {
                let id = this.containerId + '_row_' + row.toString();
                this.svg.append('g').attr('id', id);
                return new DrawingSurface(id)
                    .setHeight(rowHeight)
                    .setWidth(this._width)
                    .setY(row * (rowHeight + marginHeight)); 
            });
        }
        
        splitColumns(n: number, marginRatioRight: number): Array<Surface> {
            let columnWidth = this._width * (1 - marginRatioRight) / n;
            let marginWidth = this._width * marginRatioRight / (n - 1);
            return _.range(0, n).map((col) => {
                let id = this.containerId + '_column_' + col.toString()
                this.svg.append('g').attr('id', id);
                return new DrawingSurface(id)
                    .setHeight(this._height)
                    .setWidth(columnWidth)
                    .setX(col * (columnWidth + marginWidth));
            });
        }
        
        splitGrid(n: number, maxColumns: number, marginRatioTop: number, marginRatioRight: number): Array<Surface> {
            let nColumns = Math.ceil(Math.sqrt(n));
            if (maxColumns) {
                nColumns = Math.min(nColumns, maxColumns);
            }
            let nRows = Math.ceil(n / nColumns);
            
            let cellWidth = this._width * (1 - marginRatioRight) / nColumns;
            let cellHeight = this._height * (1 - marginRatioTop) / nRows;
            
            let marginWidth = this._width * marginRatioRight / (nColumns - 1);
            let marginHeight = this._height * marginRatioTop / (nRows - 1);
            
            return _.flatMap(_.range(0, nRows), (row) => {
                return _.range(0, nColumns)
                    .filter((col) => {
                        let i = row * nColumns + col;
                        return i < n; 
                    }).map((col) => {
                        let id = this.containerId + '_row_' + row.toString() + '_column_' + col.toString();
                        this.svg.append('g').attr('id', id);
                        return new DrawingSurface(id)
                        .setHeight(cellHeight)
                        .setWidth(cellWidth)
                        .setX(col * (cellWidth + marginWidth))
                        .setY(row * (cellHeight + marginHeight));
                    });
            });
        }
        
        splitHeader(headerHeightRatio: number): SurfaceHeaderBody {
            let headerHeight = Math.max(Math.min(headerHeightRatio * this._height, this._height), 0);
            let bodyHeight = this._height - headerHeight;
            
            let headerId = this.containerId + '_header';
            let bodyId = this.containerId + '_body';
            
            this.svg.append('g').attr('id', headerId);
            this.svg.append('g').attr('id', bodyId);
            
            let headerSurface = new DrawingSurface(headerId)
                .setWidth(this._width)
                .setHeight(headerHeight)
                .setY(0);
            let bodySurface = new DrawingSurface(bodyId)
                .setWidth(this._width)
                .setHeight(bodyHeight)
                .setY(headerHeight);
                
            return {
                header: headerSurface,
                body: bodySurface
            };
        }
        
        addCenteredColumn(idSuffix: string, cx: number, width: number): Surface {
            let id = this.containerId + '_column_' + idSuffix;
            
            this.svg.append('g').attr('id', id);
            
            let surface = new DrawingSurface(id)
                .setWidth(width)
                .setHeight(this._height)
                .setX(cx - width / 2);
                
            return surface;
        }
        
        addCenteredRow(idSuffix: string, cy: number, height: number): Surface {
            let id = this.containerId + '_row_' + idSuffix;
            
            this.svg.append('g').attr('id', id);
            
            let surface = new DrawingSurface(id)
                .setWidth(this._width)
                .setHeight(height)
                .setY(cy - height / 2);
                
            return surface;
        }
        
        addSurface(idSuffix: string, x: number, y: number, width: number, height: number): Surface {
            let id = this.containerId + '_' + idSuffix;
            
            this.svg.append('g').attr('id', id);
            
            let surface = new DrawingSurface(id)
                .setWidth(width)
                .setHeight(height)
                .setX(x)
                .setY(y);
            
            return surface;
        }
    }
}