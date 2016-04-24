/// <reference path="./Environment.ts"/>
/// <reference path="./Surface.ts"/>

module semio.interfaces {
    export interface Plotable {
        plot(surface: Surface, environment: Environment, data: Array<any>): void;
    }
}