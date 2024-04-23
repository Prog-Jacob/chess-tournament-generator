import { SingleEliminationFormat, SwissFormat } from "../../../types/formats";
import { PlayerProfile } from "../../../types/player";
import TournamentManager from "./tournament_manager";
import Player from "../../player";

class SwissManager extends TournamentManager {
    private isPlaying: Set<number>;
    private standings: PlayerProfile[];
    private gameHistory: Set<[number, number]>;

    constructor(players: Player[], format: SingleEliminationFormat) {
        super(players, format);
        this.isPlaying = new Set();
        this.gameHistory = new Set();
        this.standings = [...this.profiles];
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
            this.gameHistory.add([player, opponent]);
            this.gameHistory.add([opponent, player]);
        }
    }

    private findOpponent(player: number): number | undefined {
        return this.standings
            .map((opponent: PlayerProfile) => opponent.id)
            .find((opponent) => {
                return (
                    player !== opponent &&
                    !this.isPlaying.has(opponent) &&
                    !this.gameHistory.has([player, opponent])
                );
            });
    }

    public matchUp(player1: number, player2: number): number {
        const winProbability = this.winProbability(player1, player2);
        return Math.random() < winProbability ? player1 : player2;
    }

    public playerWon(profile: PlayerProfile): void {
        profile.gamesPlayed++;
        profile.gamesWon++;
    }

    public playerLost(profile: PlayerProfile): void {
        profile.gamesPlayed++;
        profile.gamesLost++;
    }

    public updateStandings(): void {
        this.standings = [...this.profiles].sort(
            (a, b) => b.gamesWon - a.gamesWon
        );
    }

    public getLosers(): Player[] {
        this.generateStandings();
        return this.losers.map((player) => player.player);
    }

    public getWinners(): Player[] {
        this.generateStandings();
        return this.winners.map((player) => player.player);
    }

    private generateStandings() {
        if (this.roundCheck() || this.winners.length || this.losers.length)
            return;
        const standings = this.standings.map((player) => ({ ...player }));

        standings.sort((a, b) => a.gamesWon - b.gamesWon);

        this.winners = standings.splice(-(this.format as SwissFormat).topCut);
        this.losers = standings;
    }
}

export default SwissManager;
