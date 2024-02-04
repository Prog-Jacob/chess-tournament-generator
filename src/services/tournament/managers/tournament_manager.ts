import { PlayerProfile } from "../../../types/player";
import { Format } from "../../../types/formats";

abstract class TournamentManager {
    protected profiles: Map<number, PlayerProfile>;
    protected pairings: Map<number, number>;
    protected winners: PlayerProfile[];
    protected losers: PlayerProfile[];
    protected format: Format;
    protected round: number;

    constructor(players: PlayerProfile[], format: Format) {
        if (players.some((p) => p.didGoThorough))
            throw new Error("Got bye players");
        this.profiles = new Map(players.map((player) => [player.id, player]));
        this.pairings = new Map<number, number>();
        this.format = format;
        this.winners = [];
        this.losers = [];
        this.round = 0;
    }

    public abstract generatePairings(): void;
    public abstract matchUp(player1: number, player2: number): number;
    public abstract playerLost(player: PlayerProfile): PlayerProfile;
    public abstract playerWon(player: PlayerProfile): PlayerProfile;
    public abstract getWinners(): PlayerProfile[];
    public abstract getLosers(): PlayerProfile[];
    public abstract updateStandings(): void;

    protected roundCheck(): boolean {
        return this.round < this.format.matches;
    }

    protected playerCheck(playerId: number): boolean {
        return this.profiles.get(playerId)! !== undefined;
    }

    private executeRound(): void {
        if (!this.roundCheck()) return;
        const pairings = [...this.pairings];

        for (const [player1, player2] of pairings) {
            const winner = this.matchUp(player1, player2);
            const loser = winner == player1 ? player2 : player1;
            this.profiles.set(
                winner,
                this.playerWon(this.profiles.get(winner)!)
            );
            this.profiles.set(
                loser,
                this.playerLost(this.profiles.get(loser)!)
            );
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
}

export default TournamentManager;
