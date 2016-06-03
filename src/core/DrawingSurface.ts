/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.core {
    import Surface = semio.interfaces.Surface;
    import SurfaceHeaderBody = semio.interfaces.SurfaceHeaderBody;

    export class DrawingSurface implements Surface {
        public svg: d3.Selection<any>;

        private _width: number;
        private _height: number;
        private _x: number;
        private _y: number;

        constructor(public containerId: string) {
            this.svg = d3.select("#" + containerId)
                         .append("svg");
        }

        public setWidth(width: number): Surface {
            this._width = width;
            this.svg.attr("width", width);
            return this;
        }

        public setHeight(height: number): Surface {
            this._height = height;
            this.svg.attr("height", height);
            return this;
        }

        public setX(x: number): Surface {
            this._x = x;
            this.svg.attr("x", x);
            return this;
        }

        public setY(y: number): Surface {
            this._y = y;
            this.svg.attr("y", y);
            return this;
        }

        public getWidth(): number { return this._width; }
        public getHeight(): number { return this._height; }

        public splitRows(n: number, verticalSpacingRatio: number): Array<Surface> {
            let rowHeight = n > 1 ? this._height * (1 - verticalSpacingRatio) / n : this._height;
            let marginHeight = n > 1 ? this._height * verticalSpacingRatio / (n - 1) : 0;
            return _.range(0, n).map((row) => {
                let id = this.containerId + "_row_" + row.toString();
                this.svg.append("g").attr("id", id);
                return new DrawingSurface(id)
                    .setHeight(rowHeight)
                    .setWidth(this._width)
                    .setY(row * (rowHeight + marginHeight));
            });
        }

        public splitColumns(n: number, horizontalSpacingRatio: number): Array<Surface> {
            let columnWidth = n > 1 ? this._width * (1 - horizontalSpacingRatio) / (n - 1) : this._width;
            let marginWidth = n > 1 ? this._width * horizontalSpacingRatio / (n - 1) : 0;
            return _.range(0, n).map((col) => {
                let id = this.containerId + "_column_" + col.toString();
                this.svg.append("g").attr("id", id);
                return new DrawingSurface(id)
                    .setHeight(this._height)
                    .setWidth(columnWidth)
                    .setX(col * (columnWidth + marginWidth));
            });
        }

        public splitGrid(n: number, maxColumns: number, verticalSpacingRatio: number, horizontalSpacingRatio: number): Array<Surface> {
            let nColumns = Math.ceil(Math.sqrt(n));
            if (maxColumns) {
                nColumns = Math.min(nColumns, maxColumns);
            }
            let nRows = Math.ceil(n / nColumns);

            let cellWidth = this._width * (1 - horizontalSpacingRatio) / nColumns;
            let cellHeight = this._height * (1 - verticalSpacingRatio) / nRows;

            let marginWidth = this._width * horizontalSpacingRatio / (nColumns - 1);
            let marginHeight = this._height * verticalSpacingRatio / (nRows - 1);

            return _.flatMap(_.range(0, nRows), (row) => {
                return _.range(0, nColumns)
                    .filter((col) => {
                        let i = row * nColumns + col;
                        return i < n;
                    }).map((col) => {
                        let id = this.containerId + "_row_" + row.toString() + "_column_" + col.toString();
                        this.svg.append("g").attr("id", id);
                        return new DrawingSurface(id)
                        .setHeight(cellHeight)
                        .setWidth(cellWidth)
                        .setX(col * (cellWidth + marginWidth))
                        .setY(row * (cellHeight + marginHeight));
                    });
            });
        }

        public splitHeader(headerHeightRatio: number): SurfaceHeaderBody {
            let headerHeight = Math.max(Math.min(headerHeightRatio * this._height, this._height), 0);
            let bodyHeight = this._height - headerHeight;

            let headerId = this.containerId + "_header";
            let bodyId = this.containerId + "_body";

            this.svg.append("g").attr("id", headerId);
            this.svg.append("g").attr("id", bodyId);

            let headerSurface = new DrawingSurface(headerId)
                .setWidth(this._width)
                .setHeight(headerHeight)
                .setY(0);
            let bodySurface = new DrawingSurface(bodyId)
                .setWidth(this._width)
                .setHeight(bodyHeight)
                .setY(headerHeight);

            return {
                body: bodySurface,
                header: headerSurface
            };
        }

        public addCenteredColumn(idSuffix: string, cx: number, width: number): Surface {
            let id = this.containerId + "_column_" + idSuffix;

            this.svg.append("g").attr("id", id);

            let surface = new DrawingSurface(id)
                .setWidth(width)
                .setHeight(this._height)
                .setX(cx - width / 2);

            return surface;
        }

        public addCenteredRow(idSuffix: string, cy: number, height: number): Surface {
            let id = this.containerId + "_row_" + idSuffix;

            this.svg.append("g").attr("id", id);

            let surface = new DrawingSurface(id)
                .setWidth(this._width)
                .setHeight(height)
                .setY(cy - height / 2);

            return surface;
        }

        public addSurface(idSuffix: string, x: number, y: number, width: number, height: number): Surface {
            let id = this.containerId + "_" + idSuffix;

            this.svg.append("g").attr("id", id);

            let surface = new DrawingSurface(id)
                .setWidth(width)
                .setHeight(height)
                .setX(x)
                .setY(y);

            return surface;
        }
    }
}
