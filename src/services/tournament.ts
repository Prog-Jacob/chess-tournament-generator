import { isRobin, isSwiss } from "../utils/tournament_types_map";
import RoundRobinManager from "./tournament/managers/round_robin";
import TournamentManager from "./tournament/managers/tournament_manager";
import { Tournament as TournamentType } from "./genetic_algorithm/first_generation";
import SwissManager from "./tournament/managers/swiss";
import SingleEliminationManager from "./tournament/managers/single_elemination_round";
import { PlayerProfile } from "../types/player";

class Tournament {
    private tournament: TournamentType;
    private winners: PlayerProfile[];
    private losers: PlayerProfile[];

    constructor(players: PlayerProfile[], tournament: TournamentType) {
        this.tournament = tournament;
        this.winners = [...players];
        this.losers = [];
    }

    public getTournamentResult(): PlayerProfile[] {
        for (const format of this.tournament) {
            let manager: TournamentManager;

            if (isRobin(format)) {
                manager = new RoundRobinManager(this.winners, format);
            } else if (isSwiss(format)) {
                manager = new SwissManager(this.winners, format);
            } else {
                manager = new SingleEliminationManager(this.winners, format);
            }

            manager.executeTournament();
            this.losers.push(...manager.getLosers());
            this.winners = manager.getWinners().map((profile) => ({
                ...profile,
                gamesWon: 0,
                didGoThorough: false,
            }));
        }

        return [...this.losers, ...this.winners].reverse();
    }
}

export default Tournament;
