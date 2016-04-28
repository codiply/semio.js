/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/surface.ts"/>

module semio.shape {        
    import Surface = semio.interfaces.Surface;
    
    export class Text {
        static placeTitle(surface: Surface, text: string): void {
            surface.svg.append('text')
                .attr('x', surface.getWidth() / 2)             
                .attr('y', surface.getHeight() / 2)
                .attr('text-anchor', 'middle')  
                .attr('font-size', surface.getHeight() / 2)
                .text(text);
        }
    }
}