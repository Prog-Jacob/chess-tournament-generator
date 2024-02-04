import { RoundRobinFormat } from "../../../types/formats";
import { PlayerProfile } from "../../../types/player";
import TournamentManager from "./tournament_manager";

class RoundRobinManager extends TournamentManager {
    private gameHistory: Set<string>;
    private standings: PlayerProfile[];

    constructor(players: PlayerProfile[], format: RoundRobinFormat) {
        super(players, format);
        this.gameHistory = new Set();
        this.standings = [...this.profiles.values()];
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
            if (this.gameHistory.has(JSON.stringify([player1, player2]))) {
                throw new Error("Players have already played!");
            }

            this.pairings.set(player1, player2);
            this.gameHistory.add(JSON.stringify([player1, player2]));
            this.gameHistory.add(JSON.stringify([player2, player1]));
        }
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
        if (this.standings.length % 2 === 0) {
            this.standings.splice(1, 0, this.standings.pop()!);
        } else {
            this.standings.unshift(this.standings.pop()!);
        }
        this.standings = this.standings.map(
            (player) => this.profiles.get(player.id) as PlayerProfile
        );
    }

    public matchUp(player1: number, player2: number): number {
        const winProbability = universalManager.matchUp(player1, player2);
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
        this.winners = standings.splice(
            -(this.format as RoundRobinFormat).topCut
        );
        this.losers = standings;
    }
}

export default RoundRobinManager;
