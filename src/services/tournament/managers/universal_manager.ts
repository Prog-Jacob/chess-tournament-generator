import { PlayerProfile } from "../../../types/player";
import { trapezoidalIntegration } from "../../../utils/integral";

type PDFFunction = (x: number) => number;

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

        for (let i = 0; i < players.length; i++) {
            console.log(this.profiles[i].name);
            for (let j = 0; j < players.length; j++) {
                console.log(this.profiles[j].name, this.matchUps[i][j]);
            }
            console.log("------------------");
        }
    }

    public matchUp(player1: number, player2: number): number {
        return this.matchUps[player1][player2];
    }

    protected winProbability(player1: number, player2: number): number {
        const { player1PDF, player2PDF, a, b } = this.getProbabilityParameters(
            player1,
            player2
        );
        return trapezoidalIntegration(
            (x: number) =>
                trapezoidalIntegration(
                    (y: number) => player1PDF(x) * player2PDF(y),
                    a,
                    x,
                    50
                ),
            a,
            b,
            75
        );
    }

    private getProbabilityParameters(
        player1: number,
        player2: number
    ): {
        player1PDF: PDFFunction;
        player2PDF: PDFFunction;
        a: number;
        b: number;
    } {
        const player1Distribution = this.profiles[player1].player;
        const player2Distribution = this.profiles[player2].player;
        const player1PDF = (x: number) => player1Distribution.getProbability(x);
        const player2PDF = (x: number) => player2Distribution.getProbability(x);

        const a = Math.min(
            player1Distribution.invCDF(0.001),
            player2Distribution.invCDF(0.001)
        );
        const b = Math.max(
            player1Distribution.invCDF(0.999),
            player2Distribution.invCDF(0.999)
        );

        return { player1PDF, player2PDF, a, b };
    }
}

export default UniversalManager;
