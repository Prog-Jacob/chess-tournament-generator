import { RoundRobinFormat } from "../../../types/formats";
import { PlayerProfile } from "../../../types/player";
import Player from "../../player";
import TournamentManager from "./tournament_manager";

class RoundRobinManager extends TournamentManager {
    private standings: PlayerProfile[];
    private gameHistory: Set<[number, number]>;

    constructor(players: Player[], format: RoundRobinFormat) {
        super(players, format);
        this.gameHistory = new Set();
        this.standings = [...this.profiles];
    }

    public generatePairings(): void {
        if (!this.roundCheck()) return;
        const N = this.standings.length;

        if (this.gameHistory.size == N * (N - 1)) {
            throw new Error("All games have been played!");
        }
        this.pairings.clear();

        for (let i = 0; i < N / 2; i++) {
            const player1 = this.standings[i].id;
            const player2 = this.standings[N - 1 - i].id;

            if (player1 == player2) continue;
            if (this.gameHistory.has([player1, player2])) {
                throw new Error("Players have already played!");
            }

            this.pairings.set(player1, player2);
            this.gameHistory.add([player1, player2]);
            this.gameHistory.add([player2, player1]);
        }
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
        if (this.standings.length % 2 === 0) {
            this.standings.splice(1, 0, this.standings.pop()!);
        } else {
            this.standings.unshift(this.standings.pop()!);
        }
    }

    public matchUp(player1: number, player2: number): number {
        const winProbability = this.winProbability(player1, player2);
        let player1Score = 0;
        let player2Score = 0;

        for (
            let game = 0;
            game < (this.format as RoundRobinFormat).gamesPerMatch;
            game++
        ) {
            if (Math.random() < winProbability) player1Score++;
            else player2Score++;
        }

        if (player1Score > player2Score) return player1;
        if (player1Score < player2Score) return player2;

        let match1 = Math.random() < winProbability;
        let match2 = Math.random() < winProbability;

        while (match1 != match2) {
            match1 = Math.random() < winProbability;
            match2 = Math.random() < winProbability;
        }

        return match1 ? player1 : player2;
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
        const standings = this.profiles.map((player) => ({ ...player }));

        standings.sort((a, b) => a.gamesWon - b.gamesWon);

        this.winners = standings.splice(
            -(this.format as RoundRobinFormat).topCut
        );
        this.losers = standings;
    }
}

export default RoundRobinManager;
