import { RoundRobinFormat } from "../../../types/formats";
import { TournamentGenerator } from "../../../types/tournament";

abstract class RoundRobinGenerator extends TournamentGenerator {
    public static canGenerateFormat(
        numberOfPlayers: number,
        maxRounds: number
    ): boolean {
        const matches =
            numberOfPlayers % 2 == 0 ? numberOfPlayers - 1 : numberOfPlayers;
        return numberOfPlayers > 1 && matches <= maxRounds;
    }

    public static generateRandomFormat(
        numberOfPlayers: number,
        maxRounds: number
    ): RoundRobinFormat {
        let gamesPerMatch = Math.floor(Math.random() * 2) + 1;
        const matches =
            numberOfPlayers % 2 == 0 ? numberOfPlayers - 1 : numberOfPlayers;

        if (maxRounds < matches * 2) gamesPerMatch = 1;
        const topCut = Math.floor(Math.random() * (numberOfPlayers - 1)) + 1;

        return { gamesPerMatch, matches, topCut };
    }

    public static getNumberOfRounds(format: RoundRobinFormat): number {
        return format.matches * format.gamesPerMatch;
    }

    public static getNumberOfPlayers(format: RoundRobinFormat): number {
        return format.topCut;
    }
}

export default RoundRobinGenerator;
