import { SingleEliminationFormat } from "../../../types/formats";
import { PlayerProfile } from "../../../types/player";
import TournamentManager from "./tournament_manager";

class SingleEliminationManager extends TournamentManager {
    constructor(players: PlayerProfile[], format: SingleEliminationFormat) {
        super(players, format);
        this.winners = [...this.profiles.values()];
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

                this.playerWon({ ...player, didGoThorough: true });
                standings.splice(i, 1);
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
        const winProbability = universalManager.matchUp(player1, player2);
        let match1 = Math.random() < winProbability;
        let match2 = Math.random() < winProbability;

        while (match1 != match2) {
            match1 = Math.random() < winProbability;
            match2 = Math.random() < winProbability;
        }

        return match1 ? player1 : player2;
    }

    public playerWon(profile: PlayerProfile): PlayerProfile {
        const newProfile = {
            ...profile,
            gamesWon: profile.gamesWon + 1,
            gamesPlayed: profile.gamesPlayed + 1,
        };
        this.winners.push(newProfile);
        return newProfile;
    }

    public playerLost(profile: PlayerProfile): PlayerProfile {
        return {
            ...profile,
            status: "removed",
            gamesLost: profile.gamesLost + 1,
            gamesPlayed: profile.gamesPlayed + 1,
        };
    }

    public updateStandings(): void {
        this.winners = this.winners.map(
            (player) => this.profiles.get(player.id) as PlayerProfile
        );
    }

    public getLosers(): PlayerProfile[] {
        return [...this.profiles.values()]
            .filter((profile) => profile.status == "removed")
            .sort((a, b) => a.gamesWon - b.gamesWon);
    }

    public getWinners(): PlayerProfile[] {
        return [...this.winners];
    }
}

export default SingleEliminationManager;
