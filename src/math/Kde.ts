/// <reference path="../../typings/d3/d3.d.ts"/>

module semio.math {
    export interface KdePoint {
        value: number;
        density: number;
    }

    export class Kde {
        public static estimate(kernel: (x: number) => number,
                        sample: Array<number>,
                        bandwidth: number,
                        support: Array<number>): Array<KdePoint> {
            let estimator = Kde.estimator(kernel, sample, bandwidth);
            return support.map((v) => {
                return { density: estimator(v), value: v };
            });
        }

        public static estimator(kernel: (x: number) => number,
                         sample: Array<number>,
                         bandwidth: number): (x: number) => number {
            return (x: number) => {
                return d3.mean(sample, (s: number) => kernel((x - s) / bandwidth)) / bandwidth;
            };
        }

        public static epanechnikovKernel(x: number): number {
            return Math.abs(x) <= 1 ? 0.75 * (1 - x * x) : 0;
        }
    }
}
