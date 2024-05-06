import { PlayerProfile } from "../../../types/player";
import { trapezoidalIntegration } from "../../../utils/integral";

type NumToNumFunction = (x: number) => number;

class UniversalManager {
    private matchUps: number[][];
    private profiles: PlayerProfile[];

    constructor(players: PlayerProfile[]) {
        this.profiles = [...players];
        this.matchUps = Array.from({ length: players.length }, () => []);

        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                if (i == j) continue;
                const p1 = players[i].id;
                const p2 = players[j].id;

                const winProbability = this.winProbability(p1, p2);
                this.matchUps[p2][p1] = 1 - winProbability;
                this.matchUps[p1][p2] = winProbability;
            }
        }
    }

    public matchUp(player1: number, player2: number): number {
        return this.matchUps[player1][player2];
    }

    protected winProbability(player1: number, player2: number): number {
        const { CDF, PDF, a, b } = this.getProbabilityParameters(
            player1,
            player2
        );
        return trapezoidalIntegration(
            (x: number) => (1 - CDF(x)) * PDF(x),
            a,
            b,
            100
        );
    }

    private getProbabilityParameters(
        player1: number,
        player2: number
    ): {
        CDF: NumToNumFunction;
        PDF: NumToNumFunction;
        a: number;
        b: number;
    } {
        const player1Distribution = this.profiles[player1].player;
        const player2Distribution = this.profiles[player2].player;
        const PDF = (x: number) => player2Distribution.getProbability(x);
        const CDF = (x: number) =>
            player1Distribution.getAccumulatedProbability(x);

        const a = player2Distribution.invCDF(0.0001);
        const b = player2Distribution.invCDF(0.9999);

        return { CDF, PDF, a, b };
    }
}

export default UniversalManager;
