import SingleEliminationManager from "./tournament/managers/single_elemination_round";
import TournamentManager from "./tournament/managers/tournament_manager";
import { TournamentType } from "./genetic_algorithm/first_generation";
import RoundRobinManager from "./tournament/managers/round_robin";
import { isRobin, isSwiss } from "../utils/tournament_types_map";
import SwissManager from "./tournament/managers/swiss";
import { PlayerProfile } from "../types/player";
import { shuffleArray } from "../utils/array";

class Tournament {
    private tournament: TournamentType;
    private winners: PlayerProfile[];
    private losers: PlayerProfile[];
    private n: number;

    constructor(players: PlayerProfile[], tournament: TournamentType) {
        this.tournament = tournament;
        this.winners = [...players];
        this.n = players.length;
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
            this.winners = shuffleArray(
                manager.getWinners().map((profile) => ({
                    ...profile,
                    gamesWon: 0,
                    didGoThorough: false,
                }))
            );
            if (this.winners.length + this.losers.length !== this.n) {
                throw new Error("Invalid tournament");
            }
        }

        return [...this.losers, ...this.winners].reverse();
    }
}

export default Tournament;
