import { Format } from "./formats";

export abstract class TournamentGenerator {
    abstract generateRandomFormat(
        numberOfPlayers: number,
        maxRounds: number
    ): Format;
    abstract canGenerateFormat(
        numberOfPlayers: number,
        maxRounds: number
    ): boolean;
    abstract getNumberOfRounds(format: Format): number;
    abstract getNumberOfPlayers(format: Format, players?: number): number;
}
