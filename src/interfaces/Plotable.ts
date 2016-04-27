/// <reference path="./Environment.ts"/>
/// <reference path="./Surface.ts"/>

module semio.interfaces {
    export interface Plotable {
        plot(data: Array<any>, plotables: Array<Plotable>, surface: Surface, environment: Environment): void;
        getCategoryColumns(): Array<string>;
    }
}