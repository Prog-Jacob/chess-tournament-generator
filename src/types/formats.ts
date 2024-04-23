export type SwissFormat = {
    matches: number;
    topCut: number;
};

export type SingleEliminationFormat = {
    matches: number;
};

export type RoundRobinFormat = {
    gamesPerMatch: number;
    matches: number;
    topCut: number;
};

export type Format = SwissFormat | SingleEliminationFormat | RoundRobinFormat;
