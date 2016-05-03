/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>

module semio.interfaces { 
    export interface SurfaceHeaderBody {
        header: Surface;
        body: Surface;
    }
    export interface Surface {
        containerId: string;
        svg: d3.Selection<any>;
        
        setWidth(width: number): Surface;
        setHeight(width: number): Surface;
        setX(x: number): Surface;
        setY(y: number): Surface;
        
        getWidth(): number;
        getHeight(): number;
        
        splitRows(n: number, marginRatioTop: number): Array<Surface>;
        splitColumns(n: number, marginRationRight: number): Array<Surface>;
        splitGrid(n: number, maxColumns: number, marginRatioTop: number, marginRatioRight: number): Array<Surface>;
        splitHeader(headerHeightRatio: number): SurfaceHeaderBody;
        
        addCenteredColumn(idSuffix: string, cx: number, width: number): Surface;
        addCenteredRow(idSuffix: string, cy: number, height: number): Surface;
        
        addSurface(idSuffix: string, x: number, y: number, width: number, height: number): Surface;
    }
}