import { PlayerProfile } from "../../../types/player";
import { shuffleArray } from "../../../utils/array";
import { Format } from "../../../types/formats";
import Player from "../../player";
import { trapezoidalIntegration } from "../../../utils/integral";

type PDFFunction = (x: number) => number;

abstract class TournamentManager {
    protected pairings: Map<number, number>;
    protected profiles: PlayerProfile[];
    protected winners: PlayerProfile[];
    protected losers: PlayerProfile[];
    protected format: Format;
    protected round: number;

    constructor(players: Player[], format: Format) {
        this.profiles = shuffleArray([...players]).map((player, i) => ({
            id: i,
            name: player.getName(),
            player,
            gamesWon: 0,
            gamesLost: 0,
            gamesDrawn: 0,
            status: "active",
            didGoThorough: false,
            gamesPlayed: 0,
            gamesPlayedWithBlack: 0,
            gamesPlayedWithWhite: 0,
        }));
        this.pairings = new Map<number, number>();
        this.format = format;
        this.winners = [];
        this.losers = [];
        this.round = 0;
    }

    public abstract generatePairings(): void;
    public abstract matchUp(player1: number, player2: number): number;
    public abstract playerLost(player: PlayerProfile): void;
    public abstract playerWon(player: PlayerProfile): void;
    public abstract updateStandings(): void;
    public abstract getWinners(): Player[];
    public abstract getLosers(): Player[];

    protected roundCheck(): boolean {
        return this.round < this.format.matches;
    }

    protected playerCheck(playerId: number): boolean {
        return this.profiles[playerId] !== undefined;
    }

    private executeRound(): void {
        if (!this.roundCheck()) return;
        const pairings = [...this.pairings];

        for (const [player1, player2] of pairings) {
            const winner = this.matchUp(player1, player2);
            const loser = winner == player1 ? player2 : player1;
            this.playerWon(this.profiles[winner]);
            this.playerLost(this.profiles[loser]);
        }

        this.round++;
    }

    public executeTournament(): void {
        const start = this.round;
        for (let i = start; i < this.format.matches; i++) {
            this.generatePairings();
            this.executeRound();
            this.updateStandings();
        }
    }

    protected winProbability(player1: number, player2: number): number {
        if (!this.playerCheck(player1) || !this.playerCheck(player2)) return 0;
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

    protected lossProbability(player1: number, player2: number): number {
        if (!this.playerCheck(player1) || !this.playerCheck(player2)) return 0;
        const { player1PDF, player2PDF, a, b } = this.getProbabilityParameters(
            player1,
            player2
        );

        return trapezoidalIntegration(
            (x: number) =>
                trapezoidalIntegration(
                    (y: number) => player1PDF(x) * player2PDF(y),
                    x,
                    b,
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

export default TournamentManager;
