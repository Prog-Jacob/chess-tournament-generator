import Player from "../services/player";

export type PlayerProfile = {
    id: number;
    name: string;
    player: Player;
    gamesWon: number;
    gamesLost: number;
    gamesDrawn: number;
    status: PlayerStatus;
    didGoThorough: boolean;
    gamesPlayed: number;
    gamesPlayedWithBlack: number;
    gamesPlayedWithWhite: number;
};

type PlayerStatus = "active" | "removed";

export interface DistributionParameters {
    N: number;
    mean: number;
    stdDev: number;
}

export type DistributionInput = DistributionParameters | number[];


export interface PlayerParameters {
    ratings?: number[];
    name?: string;
}