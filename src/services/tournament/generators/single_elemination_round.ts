import { SingleEliminationFormat } from "../../../types/formats";
import { TournamentGenerator } from "../../../types/tournament";

abstract class SingleEliminationGenerator extends TournamentGenerator {
    public static canGenerateFormat(
        numberOfPlayers: number,
        maxRounds: number
    ): boolean {
        return numberOfPlayers > 1 && maxRounds > 0;
    }

    public static generateRandomFormat(
        numberOfPlayers: number,
        maxRounds: number
    ): SingleEliminationFormat {
        let maxMatches = 0;

        while (numberOfPlayers > 1) {
            numberOfPlayers = Math.floor((numberOfPlayers + 1) / 2);
            maxMatches++;
        }

        const matches =
            Math.floor(Math.random() * Math.min(maxMatches, maxRounds)) + 1;

        return { matches };
    }

    public static getNumberOfRounds(format: SingleEliminationFormat): number {
        return format.matches * 2;
    }
}

export default SingleEliminationGenerator;
