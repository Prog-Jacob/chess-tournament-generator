import { Format } from "../../types/formats";
import RoundRobinGenerator from "../tournament/generators/round_robin";
import SingleEliminationGenerator from "../tournament/generators/single_elemination_round";
import SwissGenerator from "../tournament/generators/swiss";
import { shuffleArray } from "../../utils/array";

export type Tournament = Format[];

export function generateSamples(
    generationSize: number,
    numberOfPlayers: number,
    numberOfRounds: number
): Tournament[] {
    const memo: Map<[number, number], Tournament[]> = new Map();
    const generators = [
        RoundRobinGenerator,
        SingleEliminationGenerator,
        SwissGenerator,
        RoundRobinGenerator,
        SingleEliminationGenerator,
        SwissGenerator,
        RoundRobinGenerator,
        SingleEliminationGenerator,
        SwissGenerator,
    ];
    let count = 0;

    function dp(
        round: number,
        players: number,
        tournament: Tournament
    ): Tournament[] {
        if (round > numberOfRounds) return [];
        if (round === numberOfRounds) {
            count += 1;
            return [tournament];
        } else if (memo.has([round, players])) {
            const x = memo.get([round, players])!;
            count += x.length;
            return x;
        }

        const tournaments: Tournament[] = [];

        for (const generator of shuffleArray(generators)) {
            const rounds = numberOfRounds - round;

            if (generator.canGenerateFormat(players, rounds)) {
                const format = generator.generateRandomFormat(players, rounds);
                const nextTournaments = dp(
                    round + generator.getNumberOfRounds(format),
                    generator.getNumberOfPlayers(format, players),
                    [...tournament, format]
                );

                tournaments.push(...nextTournaments);
                if (count > generationSize) break;
            }
        }

        memo.set([round, players], tournaments);
        return tournaments;
    }

    let previousCount = -1;
    const generation: Set<Tournament> = new Set();

    while (count < generationSize && count !== previousCount) {
        memo.clear();
        previousCount = count;
        dp(0, numberOfPlayers, []).forEach((tournament) =>
            generation.add(tournament)
        );
        count = generation.size;
    }

    return shuffleArray([...generation]);
}
