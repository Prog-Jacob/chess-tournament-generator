import { isRobin, isSwiss } from "../utils/tournament_types_map";
import Player from "./player";
import RoundRobinManager from "./tournament/managers/round_robin";
import TournamentManager from "./tournament/managers/tournament_manager";
import { Tournament as TournamentType } from "./genetic_algorithm/first_generation";
import SwissManager from "./tournament/managers/swiss";
import SingleEliminationManager from "./tournament/managers/single_elemination_round";

class Tournament {
    private players: Player[];
    private tournament: TournamentType;
    private winners: Player[];
    private losers: Player[];

    constructor(players: Player[], tournament: TournamentType) {
        this.players = players;
        this.tournament = tournament;
        this.winners = [...players];
        this.losers = [];
    }

    public getTournamentResult(): Player[] {
        for (const format of this.tournament) {
            let manager: TournamentManager;
            if (isRobin(format)) {
                manager = new RoundRobinManager(this.winners, format);
            } else if (isSwiss(format)) {
                manager = new SwissManager(this.winners, format);
            } else {
                manager = new SingleEliminationManager(this.players, format);
            }
            manager.executeTournament();
            this.winners = manager.getWinners();
            this.losers = [...this.losers, ...manager.getLosers()];
        }

        return [...this.losers, ...this.winners].reverse();
    }
}

export default Tournament;
