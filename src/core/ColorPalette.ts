/// <reference path="../../typings/d3/d3.d.ts"/>

module semio.core {
    export class ColorPalette {
        private static _qualitativeColors12: Array<string> = 
            ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c',
             '#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];
        
        static qualitative(values: Array<string>): (x: string) => string   {
            // TODO: Handle more than 20 colours
            var colors = ColorPalette._qualitativeColors12.slice(0, values.length);
            var mapping: {[x: string]: string } = { };
            _.zip(values, colors).forEach((x) => {
               mapping[x[0]] = x[1]; 
            });
            return (x: string) => mapping[x];
        } 
    }
}