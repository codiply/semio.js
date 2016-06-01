/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.shape {
    import Surface = semio.interfaces.Surface;

    export class Text {
        public static placeTitle(surface: Surface, text: string): void {
            surface.svg.append("text")
                .attr("x", surface.getWidth() / 2)
                .attr("y", surface.getHeight() / 2)
                .attr("text-anchor", "middle")
                .attr("font-size", surface.getHeight() / 2)
                .text(text);
        }
    }
}
