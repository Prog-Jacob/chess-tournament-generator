import SkewedNormalDistribution from "./skewed_normal_distribution";

class Player extends SkewedNormalDistribution {
    private name: string;
    private ratings: number[];
    constructor(ratings: number[], name?: string) {
        super(ratings);
        this.ratings = ratings;
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
