/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/surface.ts"/>
/// <reference path="../interfaces/context.ts"/>

module semio.shape {
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;
    
    export class Legend {
        private _horizontalSpacingRatio = 0.1;
        private _columns: Array<string> = [];
        
        addColumn(column: string): Legend {
            this._columns.push(column);
            return this;
        }
        
        draw(surface: Surface, context: Context): void {
            if (!this._columns)
                return;
                
            let nColumns = this._columns.length;
            let subSurfaces = surface.splitRows(nColumns, this._horizontalSpacingRatio);
            for (let i = 0; i < nColumns; i++) {
                let column = this._columns[i];
                let subSurface = subSurfaces[i];
                this.drawLegend(column, subSurface, context);
            }
            
        }
        
        private drawLegend(column: string, surface: Surface, context: Context) {
            let colors = context.getCategoryColours(column);
            let values = context.getCategoryValues(column);
            
            let blockHeight = surface.getHeight() / values.length;
            
            let rects = surface.svg.append('g')
                .selectAll('rect')
                .data(values)
                .enter()
                .append('rect')
                .attr('width', surface.getWidth() * 4 / 5)
                .attr('height', blockHeight / 5)
                .attr('x', surface.getWidth() / 10)
                .attr('y', (d, i) => (i + 1 / 10) * blockHeight)
                .attr('fill', (d) => colors(d));
            
            let labels = surface.svg.append('g')
                .selectAll('text')
                .data(values)
                .enter()
                .append('text')
                .attr('x', surface.getWidth() / 2)
                .attr('y', (d, i) => (i + 3 / 5) * blockHeight)
                .attr('text-anchor', 'middle')  
                .attr('font-size', blockHeight * 1 / 5)
                .text((d) => d);
        }
    }
    
}