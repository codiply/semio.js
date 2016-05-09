module semio.interfaces {
    export interface Tooltip {
        addOn(selection: d3.Selection<any>, html: (d: any) => string): d3.Selection<any>;
    }
}