/// <reference path="./Context.ts"/>
/// <reference path="./Surface.ts"/>

module semio.interfaces {
    export interface Plotable {
        add(plotable: Plotable): Plotable;
        plot(data: Array<any>, surface: Surface, context: Context): void;
        getCategoryColumns(): Array<string>;
        getNumericColumns(): Array<string>;
    }
}