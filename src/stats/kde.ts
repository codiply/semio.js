/// <reference path="../../typings/d3/d3.d.ts"/>

module semio.stats {
    export interface kdePoint {
        value: number,
        density: number
    }
        
    export class kde {
        static estimate(kernel: (x: number) => number,
                        sample: Array<number>,
                        bandwidth: number,
                        support: Array<number>): Array<kdePoint> {
            let estimator = kde.estimator(kernel, sample, bandwidth);
            return support.map((v) => { 
                return { value: v, density: estimator(v) };
            });
        }
        
        static estimator(kernel: (x: number) => number, 
                         sample: Array<number>, 
                         bandwidth: number): (x: number) => number {
            return (x: number) => {
                return d3.mean(sample, (s: number) => kernel((x - s) / bandwidth)) / bandwidth;
            }
        }
        
        static epanechnikovKernel(x: number): number {
            return Math.abs(x) <= 1 ? 0.75 * (1 - x * x) : 0;
        }
    }
}