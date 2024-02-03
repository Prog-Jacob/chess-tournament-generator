import { isRobin, isSwiss } from "../../../utils/tournament_types_map";
import SingleEliminationGenerator from "./single_elimination_round";
import RoundRobinGenerator from "./round_robin";
import { Format } from "../../../types/formats";
import SwissGenerator from "./swiss";

export abstract class Generator {
    public static getNumberOfRounds(format: Format): number {
        if (isRobin(format))
            return RoundRobinGenerator.getNumberOfRounds(format);
        if (isSwiss(format)) return SwissGenerator.getNumberOfRounds(format);
        return SingleEliminationGenerator.getNumberOfRounds(format);
    }
    public static getNumberOfPlayers(format: Format, players?: number): number {
        if (isRobin(format))
            return RoundRobinGenerator.getNumberOfPlayers(format);
        if (isSwiss(format)) return SwissGenerator.getNumberOfPlayers(format);
        return SingleEliminationGenerator.getNumberOfPlayers(format, players!);
    }
}
