import jstat from "jstat";

const MAX_ELO = 5_000;
const ELO_RATE_OF_CHANGE = 100;

class SkewedNormalDistribution {
    private mean: number;
    private stdDev: number;
    private skewness: number;
    private probabilities: number[];

    constructor(ratings: number[]) {
        this.mean = jstat.mean(ratings);
        this.stdDev = jstat.stdev(ratings);
        this.skewness = this.CalculateSkewness(ratings);

        let accumulator = 0;
        const xValues = jstat.seq(0, MAX_ELO, MAX_ELO);

        this.probabilities = xValues.map((x: number) => {
            accumulator += this.getProbability(x);
            return accumulator;
        });
    }

    public CalculateSkewness(ratings: number[]): number {
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
        const cdf = jstat.normal.cdf(z * this.skewness, 0, 1);
        const pdf = jstat.normal.pdf(z, 0, 1);
        return (2 * cdf * pdf) / this.stdDev;
    }

    public getAccumulatedProbability(x: number): number {
        return this.probabilities[x] || 0;
    }

    public getMean(): number {
        return this.mean;
    }

    public cdf(probability: number): number {
        let left = 0,
            right = this.probabilities.length;

        while (left < right) {
            const MID = Math.floor((left + right) / 2);

            if (this.probabilities[MID] < probability) {
                left = MID + 1;
            } else {
                right = MID;
            }
        }

        return left;
    }
}

export default SkewedNormalDistribution;
