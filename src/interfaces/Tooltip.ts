module semio.interfaces {
    export interface Tooltip {
        addOn<T>(selection: d3.Selection<T>, html: (d: T) => string): d3.Selection<T>;
    }
}