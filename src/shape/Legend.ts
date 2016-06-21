/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/surface.ts"/>
/// <reference path="../interfaces/context.ts"/>
/// <reference path="../shape/Text.ts"/>

module semio.shape {
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;
    import Text = semio.shape.Text;

    export class Legend {
        private _horizontalSpacingRatio = 0.1;
        private _columns: Array<string> = [];

        public addColumn(column: string): Legend {
            if (column) {
                this._columns.push(column);
            }
            return this;
        }

        public draw(surface: Surface, context: Context): void {
            if (!this._columns) {
                return;
            }

            let nColumns = this._columns.length;
            let subSurfaces = surface.splitRows(nColumns, this._horizontalSpacingRatio);
            for (let i = 0; i < nColumns; i++) {
                let column = this._columns[i];
                let subSurface = subSurfaces[i];
                this.drawLegend(column, subSurface, context);
            }

        }

        private drawLegend(column: string, surface: Surface, context: Context) {
            let split = surface.splitLeftRight(0.7);

            Text.placeVerticalText(split.right, column);

            let legendSurface = split.left;

            let colors = context.getCategoryColours(column);
            let values = context.getCategoryValues(column);

            let blockHeight = legendSurface.getHeight() / (values.length + 1);

            let rects = legendSurface.svg.append("g")
                .selectAll("rect")
                .data(values)
                .enter()
                .append("rect")
                .attr("width", legendSurface.getWidth() * 0.8)
                .attr("height", blockHeight * 0.8)
                .attr("x", legendSurface.getWidth() * 0.1)
                .attr("y", (d, i) => (i + 0.6 ) * blockHeight)
                .attr("fill", (d) => colors(d));

            context.getTooltip().addOn(rects, (value) => {
               return column + ": " + value;
            });
        }
    }
}

