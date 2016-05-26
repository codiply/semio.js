/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/surface.ts"/>
/// <reference path="../interfaces/context.ts"/>

module semio.shape {
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;
    
    export class Legend {
        private _columns: Array<string> = [];
        
        addColumn(column: string): Legend {
            this._columns.push(column);
            return this;
        }
        
        draw(surface: Surface, context: Context): void {
            
        }
    }
    
}