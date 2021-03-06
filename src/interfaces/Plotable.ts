/// <reference path="./Context.ts"/>
/// <reference path="./Surface.ts"/>

module semio.interfaces {
    export interface Plotable {
        plot(data: Array<any>, surface: Surface, context: Context): void;
        getCategoricalColumns(): Array<string>;
        getNumericColumns(): Array<string>;
    }
}
