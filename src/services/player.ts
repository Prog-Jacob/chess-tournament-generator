import jstat from "jstat";
import { DistributionInput } from "../types/player";
import SkewedNormalDistribution from "./skewed_normal_distribution";

class Player extends SkewedNormalDistribution {
    private name: string;
    private ratings: number[];
    constructor(input?: DistributionInput, name?: string) {
        if (!(input instanceof Array)) {
            const { N, mean, stdDev } = input
                ? input
                : {
                    mean: Math.floor(Math.random() * 2_000) + 800,
                    stdDev: Math.floor(Math.random() * 200),
                    N: Math.floor(Math.random() * 40) + 10,
                };
            input = generateRatings(N, mean, stdDev, Math.random() * 2.5 - 1);
        }

        super(input);
        this.ratings = input;
        this.name = name ? name : "Player " + Math.floor(Math.random() * 1e6);
    }

    public getName(): string {
        return this.name;
    }

    public getRatings(): number[] {
        return this.ratings;
    }
}

function generateRatings(N: number, mean: number, stdDev: number, trend: number): number[] {
    const x = Array.from({ length: N }, (_, i) => i);
    const values = x.map((value, i) => trend * value * (1 + i * Math.E ** (Math.random()) / N));

    const currentMean = jstat.mean(values);
    const currentStdDev = jstat.stdev(values);

    values.forEach((value, i) => {
        values[i] = mean + ((value - currentMean) * stdDev) / currentStdDev;
    });

    return values;
}

export default Player;
