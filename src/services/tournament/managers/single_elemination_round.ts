import { SingleEliminationFormat } from "../../../types/formats";
import { PlayerProfile } from "../../../types/player";
import TournamentManager from "./tournament_manager";
import Player from "../../player";

class SingleEliminationManager extends TournamentManager {
    constructor(players: Player[], format: SingleEliminationFormat) {
        super(players, format);
        this.winners = [...this.profiles];
    }

    public generatePairings(): void {
        if (!this.roundCheck()) return;
        const standings = [...this.winners];
        this.pairings.clear();
        this.winners = [];

        if (standings.length % 2 == 1) {
            for (let i = 0; i < standings.length; i++) {
                const player = standings[i];
                if (player.didGoThorough) continue;

                standings.splice(i, 1);
                this.playerWon(player);
                player.didGoThorough = true;
                this.profiles[player.id] = player;
                break;
            }
        }

        for (let i = 0; i < standings.length; i += 2) {
            const player1 = standings[i].id;
            const player2 = standings[i + 1].id;
            this.pairings.set(player1, player2);
        }
    }

    public matchUp(player1: number, player2: number): number {
        const winProbability = this.winProbability(player1, player2);
        let match1 = Math.random() < winProbability;
        let match2 = Math.random() < winProbability;

        while (match1 != match2) {
            match1 = Math.random() < winProbability;
            match2 = Math.random() < winProbability;
        }

        return match1 ? player1 : player2;
    }

    public playerWon(profile: PlayerProfile): void {
        this.winners.push(profile);
        profile.gamesPlayed++;
        profile.gamesWon++;
    }

    public playerLost(profile: PlayerProfile): void {
        profile.status = "removed";
        profile.gamesPlayed++;
        profile.gamesLost++;
    }

    public updateStandings(): void {}

    public getLosers(): Player[] {
        return this.profiles
            .filter((profile) => profile.status == "removed")
            .sort((a, b) => a.gamesWon - b.gamesWon)
            .map((profile) => profile.player);
    }

    public getWinners(): Player[] {
        return this.winners.map((profile) => profile.player);
    }
}

export default SingleEliminationManager;
