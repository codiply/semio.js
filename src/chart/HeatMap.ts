/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Plotable.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.chart {
    import Context = semio.interfaces.Context;
    import Plotable = semio.interfaces.Plotable;
    import Surface = semio.interfaces.Surface;

    export class HeatMap implements Plotable {
        
        
        getCategoricalColumns(): Array<string> {
            return [];
        }
        
        getNumericColumns(): Array<string> {
            return [];
        }
        
        plot(data: Array<any>, surface: Surface, context: Context): void {
            if (!data)
                return;
        }
    }
}