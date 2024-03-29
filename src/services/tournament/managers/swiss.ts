import { SingleEliminationFormat, SwissFormat } from "../../../types/formats";
import { PlayerProfile } from "../../../types/player";
import TournamentManager from "./tournament_manager";

class SwissManager extends TournamentManager {
    private isPlaying: Set<number>;
    private gameHistory: Set<string>;
    private standings: PlayerProfile[];

    constructor(players: PlayerProfile[], format: SingleEliminationFormat) {
        super(players, format);
        this.isPlaying = new Set();
        this.gameHistory = new Set();
        this.standings = [...this.profiles.values()];
    }

    public generatePairings(): void {
        if (!this.roundCheck()) return;
        const N = this.standings.length;

        if (this.gameHistory.size == N * (N - 1)) this.gameHistory.clear();
        this.isPlaying.clear();
        this.pairings.clear();

        for (let i = 0; i < N; i++) {
            const player = this.standings[i].id;
            if (this.isPlaying.has(player)) continue;

            const opponent = this.findOpponent(player);
            if (opponent === undefined) continue;

            this.isPlaying.add(player);
            this.isPlaying.add(opponent);
            this.pairings.set(player, opponent);
            this.gameHistory.add(JSON.stringify([player, opponent]));
            this.gameHistory.add(JSON.stringify([opponent, player]));
        }
    }

    private findOpponent(player: number): number | undefined {
        return this.standings
            .map((opponent: PlayerProfile) => opponent.id)
            .find((opponent) => {
                return (
                    player !== opponent &&
                    !this.isPlaying.has(opponent) &&
                    !this.gameHistory.has(JSON.stringify([player, opponent]))
                );
            });
    }

    public matchUp(player1: number, player2: number): number {
        const winProbability = universalManager.matchUp(player1, player2);
        return Math.random() < winProbability ? player1 : player2;
    }

    public playerWon(profile: PlayerProfile): PlayerProfile {
        return {
            ...profile,
            gamesWon: profile.gamesWon + 1,
            gamesPlayed: profile.gamesPlayed + 1,
        };
    }

    public playerLost(profile: PlayerProfile): PlayerProfile {
        return {
            ...profile,
            gamesLost: profile.gamesLost + 1,
            gamesPlayed: profile.gamesPlayed + 1,
        };
    }

    public updateStandings(): void {
        this.standings = [...this.profiles.values()].sort(
            (a, b) => b.gamesWon - a.gamesWon
        );
    }

    public getLosers(): PlayerProfile[] {
        this.generateStandings();
        return [...this.losers];
    }

    public getWinners(): PlayerProfile[] {
        this.generateStandings();
        return [...this.winners];
    }

    private generateStandings() {
        if (this.roundCheck() || this.winners.length || this.losers.length)
            return;
        const standings = [...this.profiles.values()];
        standings.sort((a, b) => a.gamesWon - b.gamesWon);
        this.winners = standings.splice(-(this.format as SwissFormat).topCut);
        this.losers = standings;
    }
}

export default SwissManager;
