/// <reference path="./Environment.ts"/>
/// <reference path="./Surface.ts"/>

module semio.interfaces {
    export interface Plotable {
        add(plotable: Plotable): Plotable;
        plot(data: Array<any>, surface: Surface, environment: Environment): void;
        getCategoryColumns(): Array<string>;
    }
}