import { TournamentGenerator } from "../../../types/tournament";
import { SwissFormat } from "../../../types/formats";

abstract class SwissGenerator extends TournamentGenerator {
    public static canGenerateFormat(
        numberOfPlayers: number,
        maxRounds: number
    ): boolean {
        return numberOfPlayers > 1 && maxRounds > 0;
    }

    public static generateRandomFormat(
        numberOfPlayers: number,
        maxRounds: number
    ): SwissFormat {
        const topCut = Math.floor(Math.random() * (numberOfPlayers - 1)) + 1;
        const matches = Math.floor(Math.random() * maxRounds) + 1;
        return { matches, topCut };
    }

    public static getNumberOfRounds(format: SwissFormat): number {
        return format.matches;
    }

    public static getNumberOfPlayers(format: SwissFormat): number {
        return format.topCut;
    }
}

export default SwissGenerator;
