import { isRobin, isSwiss } from "./tournament_types_map";
import { FormatProps } from "../views/Results";
import { Format } from "../types/formats";

export const mapToFormat = (format: Format, players: number): FormatProps => {
    let props;
    if (isRobin(format)) {
        props = { players, ...format, type: "Round Robin" };
    } else if (isSwiss(format)) {
        props = { players, ...format, gamesPerMatch: 1, type: "Swiss System" };
    } else {
        let topCut = players;
        for (let i = 0; i < format.matches; i++) {
            topCut = Math.floor((topCut + 1) / 2);
        }
        props = {
            players: players,
            ...format,
            gamesPerMatch: 2,
            topCut,
            type: "Single Elimination",
        };
    }

    return props;
};
