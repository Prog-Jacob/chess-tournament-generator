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
