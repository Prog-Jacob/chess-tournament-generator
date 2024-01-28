import { Format, RoundRobinFormat, SwissFormat } from "../types/formats";

export function isRobin(format: Format): format is RoundRobinFormat {
    return (format as RoundRobinFormat).gamesPerMatch !== undefined;
}

export function isSwiss(format: Format): format is SwissFormat {
    return (format as SwissFormat).topCut !== undefined;
}
