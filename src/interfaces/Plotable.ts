/// <reference path="./Environment.ts"/>
/// <reference path="./Surface.ts"/>

module semio.interfaces {
    export interface Plotable {
        add(plotable: Plotable): Plotable;
        plot(data: Array<any>, surface: Surface, environment: Environment): void;
        // TODO: change these into sets
        getCategoryColumns(): Array<string>;
        getNumericColumns(): Array<string>;
    }
}