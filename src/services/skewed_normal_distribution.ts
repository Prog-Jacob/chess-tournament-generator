import jstat from "jstat";
import { trapezoidalIntegration } from "../utils/integral";

const MAX_ELO = 5_000;
const ELO_RATE_OF_CHANGE = 100;

class SkewedNormalDistribution {
    private mean: number;
    private stdDev: number;
    private skewness: number;

    constructor(input: number[]) {
        this.mean = jstat.mean(input);
        this.stdDev = jstat.stdev(input);
        this.skewness = this.calculateSkewness(input);
    }

    public getMean(): number {
        return this.mean;
    }

    public getStdDev(): number {
        return this.stdDev;
    }

    public getSkewness(): number {
        return this.skewness;
    }

    public calculateSkewness(ratings: number[]): number {
        let skewness = 0;
        const N = ratings.length;
        const SCALE = ELO_RATE_OF_CHANGE * N;

        for (let i = 1; i < N; i++) {
            const RATING_DIFFERENCE = ratings[i] - ratings[i - 1];
            skewness += (RATING_DIFFERENCE * i) / SCALE;
        }

        return skewness;
    }

    public getProbability(x: number): number {
        const z = (x - this.mean) / this.stdDev;
        const pdf = jstat.normal.pdf(z, 0, 1);
        const cdf = jstat.normal.cdf(z * this.skewness, 0, 1);
        return (2 * pdf * cdf) / this.stdDev;
    }

    public getAccumulatedProbability(x: number): number {
        const z = (x - this.mean) / this.stdDev;
        const cdf = jstat.normal.cdf(z, 0, 1);
        const owensT = this.owensT(z, this.skewness);
        return cdf - 2 * owensT;
    }

    private owensT(h: number, a: number): number {
        const f = (x: number) =>
            Math.exp(-0.5 * h * h * (1 + x * x)) / (1 + x * x);
        return trapezoidalIntegration(f, 0, a) / (2 * Math.PI);
    }

    public invCDF(probability: number): number {
        let l = 0,
            r = MAX_ELO;

        while (r - l > 1) {
            const m = (l + r) / 2;
            if (this.getAccumulatedProbability(m) < probability) {
                l = m;
            } else {
                r = m;
            }
        }

        return l;
    }
}

export default SkewedNormalDistribution;
