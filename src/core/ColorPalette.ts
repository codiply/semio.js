/// <reference path="../../typings/d3/d3.d.ts"/>

module semio.core {
    export class ColorPalette {
        private static _qualitativeColors12: Array<string> =
            ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c",
             "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"];
        private static _qualitativeColors20: Array<string> =
            ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
             "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
             "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5",
             "#c49c94", "#f7b6d2", "#c7c7c7", "#dbdb8d", "#9edae5"];

        private static _sequentialColors9: Array<string> =
            ["#fff7fb", "#ece7f2", "#d0d1e6",
             "#a6bddb", "#74a9cf", "#3690c0",
             "#0570b0", "#045a8d", "#023858"];

        public static qualitative(values: Array<string>): (x: string) => string  {
            let colors: Array<string>;
            if (values.length <= 12) {
                colors = ColorPalette._qualitativeColors12.slice(0, values.length);
            } else if (values.length <= 20) {
                colors = ColorPalette._qualitativeColors20.slice(0, values.length);
            }
            let mapping: {[x: string]: string } = { };
            _.zip(values, colors).forEach((x) => {
               mapping[x[0]] = x[1];
            });
            return (x: string) => mapping[x];
        }

        public static sequential(values: Array<number>): (x: number) => string {
            return d3.scale.quantile<string>()
                  .domain(d3.extent(values))
                  .range(ColorPalette._sequentialColors9);
        }
    }
}
