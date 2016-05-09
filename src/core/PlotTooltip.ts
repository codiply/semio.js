/// <reference path="../interfaces/Tooltip.ts"/>

module semio.core {
    import Tooltip = semio.interfaces.Tooltip;
    
    export class PlotTooltip implements Tooltip { 
        private _container: d3.Selection<any>; 
        private _tooltip: d3.Selection<any>; 
        
        constructor(private containerId: string) {
            this._container = d3.select('#' + containerId);
            this._tooltip = this._container
              .append('div')
              .attr('class', 'tooltip')
              .style('position', 'absolute')
              .style('z-index', '10')
              .style('visibility', 'hidden');
        }
        
        addOn(selection: d3.Selection<any>, html: (d: any) => string): d3.Selection<any> {
            let that = this;
            return selection.on('mouseover', function(d) {
                return that._tooltip
                  .style('visibility', 'visible')
                  .html(html(d));
            })
            .on('mousemove', function(d) { 
                let mouse = d3.mouse(document.body);
                return that._tooltip
                    .style('top', (mouse[1] - 10) + 'px')
                    .style('left',(mouse[0] + 10) + 'px'); })
            .on('mouseout', function(d) { 
                return that._tooltip.style('visibility', 'hidden'); 
            });
        }        
    }
}