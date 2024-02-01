import {
    Format,
    RoundRobinFormat,
    SingleEliminationFormat,
    SwissFormat,
} from "../types/formats";

export function isRobin(format: Format): format is RoundRobinFormat {
    return (format as RoundRobinFormat).gamesPerMatch !== undefined;
}

export function isSwiss(format: Format): format is SwissFormat {
    return !isRobin(format) && (format as SwissFormat).topCut !== undefined;
}

export function isSingleElimination(
    format: Format
): format is SingleEliminationFormat {
    return !isRobin(format) && !isSwiss(format);
}
