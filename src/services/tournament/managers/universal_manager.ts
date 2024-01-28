import { PlayerProfile } from "../../../types/player";
import { trapezoidalIntegration } from "../../../utils/integral";

type PDFFunction = (x: number) => number;

class UniversalManager {
    private profiles: PlayerProfile[];
    private matchUps: Map<[number, number], number> = new Map();

    constructor(players: PlayerProfile[]) {
        this.profiles = [...players];

        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                const p1 = Math.min(players[i].id, players[j].id);
                const p2 = Math.max(players[i].id, players[j].id);
                this.matchUps.set([p1, p2], this.winProbability(p1, p2));
            }
        }
    }

    public matchUp(player1: number, player2: number): number {
        if (player1 < player2) {
            return this.matchUps.get([player1, player2]) || 0;
        } else {
            return 1 - this.matchUps.get([player2, player1])!;
        }
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
                    10
                ),
            a,
            b
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
