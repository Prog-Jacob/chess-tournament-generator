import SkewedNormalDistribution from "./skewed_normal_distribution";
import { DistributionInput } from "../types/player";

function generateEloRatings(
    numOfGames: number,
    initialRating: number,
    growthRate: number
): number[] {
    let rating = initialRating;
    const ratings: number[] = [];

    for (let i = 0; i < numOfGames; i++) {
        const growthFactor = Math.floor(Math.random() * 10) + 2;
        let growth = Math.random() < growthRate ? growthFactor : -growthFactor;

        while (growth + rating > 2900 || growth + rating < 400) {
            growth = Math.random() < growthRate ? growthFactor : -growthFactor;
        }

        rating += growth;
        ratings[i] = rating;
    }

    return ratings;
}

class Player extends SkewedNormalDistribution {
    private name: string;
    private ratings: number[];
    constructor(input?: DistributionInput, name?: string) {
        if (!(input instanceof Array)) {
            const { initialRating, growthRate } = input
                ? input
                : {
                      initialRating: Math.floor(Math.random() * 2_000) + 500,
                      growthRate: Math.random() + 0.1,
                  };
            const N = Math.floor(Math.random() * 50) + 25;
            input = generateEloRatings(N, initialRating, growthRate);
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

export default Player;
