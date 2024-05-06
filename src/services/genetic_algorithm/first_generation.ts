import { Format } from "../../types/formats";
import RoundRobinGenerator from "../tournament/generators/round_robin";
import SingleEliminationGenerator from "../tournament/generators/single_elimination_round";
import SwissGenerator from "../tournament/generators/swiss";
import { shuffleArray } from "../../utils/array";
import { TournamentGenerator } from "../../types/tournament";

export type Tournament = Format[];

export function generateSamples(
    generationSize: number,
    numberOfPlayers: number,
    numberOfRounds: number
): Tournament[] {
    const totalTournaments: Set<string> = new Set();
    const memo: Set<Tournament>[][] = Array.from(
        { length: numberOfRounds + 1 },
        () => []
    );

    function dp(
        round: number,
        players: number,
        tournament: Tournament
    ): Set<Tournament> {
        if (round > numberOfRounds) return new Set();
        if (round === numberOfRounds) {
            totalTournaments.add(JSON.stringify(tournament));
            return new Set([tournament]);
        }

        const rounds = numberOfRounds - round;
        const tournaments: Set<Tournament> = new Set();

        if (memo[rounds][players] !== undefined) {
            for (const nextTournament of memo[rounds][players].values()) {
                const finalTournament = [...tournament, ...nextTournament];
                totalTournaments.add(JSON.stringify(finalTournament));
                tournaments.add(finalTournament);
            }
            return tournaments;
        }

        for (const generator of getGenerators()) {
            if (generator.canGenerateFormat(players, rounds)) {
                const format = generator.generateRandomFormat(players, rounds);
                const nextTournaments = dp(
                    round + generator.getNumberOfRounds(format),
                    generator.getNumberOfPlayers(format, players),
                    [...tournament, format]
                );

                if (totalTournaments.size > generationSize) break;
                [...nextTournaments].forEach((finalTournament) =>
                    tournaments.add(finalTournament)
                );
            }
        }

        memo[round][players] = tournaments;
        return tournaments;
    }

    dp(0, numberOfPlayers, []);
    return shuffleArray(
        [...totalTournaments].map((tournament) => JSON.parse(tournament))
    );
}

function getGenerators(): TournamentGenerator[] {
    const generators = [
        SwissGenerator,
        SwissGenerator,
        RoundRobinGenerator,
        RoundRobinGenerator,
        SingleEliminationGenerator,
        SingleEliminationGenerator,
    ];
    return shuffleArray(generators);
}
