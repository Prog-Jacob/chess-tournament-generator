import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PlayerParameters, PlayerProfile } from "../types/player";
import Player from "../services/player";
import GeneticAlgorithm from "../services/genetic_algorithm/genetic_algorithm";
import { shuffleArray } from "../utils/array";
import {
    Box,
    Button,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { FaPlay } from "react-icons/fa";
import RatingPlot from "../components/RatingPlot";
import { Format as FormatType } from "../types/formats";
import { isRobin, isSwiss } from "../utils/tournament_types_map";

export interface FormatProps {
    type: string;
    players: number;
    matches: number;
    gamesPerMatch: number;
    topCut: number;
}

function Format({ format }: { format: FormatProps }) {
    const { type, players, matches, gamesPerMatch, topCut } = format;

    return (
        <Box
            sx={{
                p: 2,
                border: 2,
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            <Typography variant="h4" fontWeight="medium">
                {type}
            </Typography>
            <Typography variant="h6" color="text.secondary">
                Players: {players}
            </Typography>
            <Typography variant="h6" color="text.secondary">
                Matches: {matches}
            </Typography>
            <Typography variant="h6" color="text.secondary">
                Qualifiers: {topCut}
            </Typography>
            <Typography variant="h6" color="text.secondary">
                Games Per Match: {gamesPerMatch}
            </Typography>
        </Box>
    );
}

const mapToFormat = (format: FormatType, players: number): FormatProps => {
    let props;
    if (isRobin(format)) {
        props = { players, ...format, type: "Robin Round" };
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

const Results = () => {
    const [mode, setMode] = useState<string>();
    const [round, setRound] = useState<number>();
    const [players, setPlayers] = useState<PlayerProfile[]>([]);
    const [geneticAlgorithm, setGeneticAlgorithm] =
        useState<GeneticAlgorithm>();
    const [searchParams] = useSearchParams();
    const [input, setInput] = useState<string>("");
    const [showCount, setShowCount] = useState(10);
    const [standings, setStandings] = useState<Player[]>();
    const [generation, setGeneration] = useState<number>(0);

    useEffect(() => {
        const roundParam = parseInt(searchParams.get("rounds") || "10");
        const modeParam = searchParams.get("mode") || "Fair";
        const playersParameters =
            JSON.parse(localStorage.getItem("players")!) || [];
        const newPlayers: Player[] = playersParameters.map(
            (player: PlayerParameters) =>
                new Player(player.ratings, player.name)
        );

        const playersProcessed: PlayerProfile[] = shuffleArray([
            ...newPlayers,
        ]).map((player, i) => ({
            id: i,
            name: player.getName(),
            player,
            gamesWon: 0,
            gamesLost: 0,
            gamesDrawn: 0,
            status: "active",
            didGoThorough: false,
            gamesPlayed: 0,
            gamesPlayedWithBlack: 0,
            gamesPlayedWithWhite: 0,
        }));

        setMode(modeParam);
        setRound(roundParam);
        setPlayers(playersProcessed);
        setGeneticAlgorithm(
            new GeneticAlgorithm(playersProcessed, 100, roundParam, modeParam)
        );
    }, []);

    const handleAdvancingGeneration = () => {
        const num = parseInt(input);
        if (isNaN(num) || num < 1 || num > 20) {
            alert("Please enter a valid number between 1 and 20.");
        } else {
            geneticAlgorithm?.advanceGenerationBy(num);
            setGeneration((generation) => generation + num);
            setStandings(() => [
                ...(geneticAlgorithm?.getTournamentResults() || []),
            ]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    return (
        <Box
            sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {mode && round ? (
                <Box
                    sx={{
                        mt: 4,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: 2,
                                    backgroundColor: "#f7f7f7",
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    color="var(--secondary)"
                                >
                                    Current Generation: {generation}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color="var(--secondary)"
                                >
                                    Number of Players: {players.length}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color="var(--secondary)"
                                >
                                    Mode: {mode}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color="var(--secondary)"
                                >
                                    Round: {round}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: 2,
                                    backgroundColor: "#f7f7f7",
                                }}
                            >
                                <TextField
                                    id="standard-number"
                                    label="Advance Generations"
                                    type="number"
                                    value={input}
                                    onChange={handleChange}
                                    sx={{ width: "100%", mb: 2 }}
                                />
                                <IconButton
                                    aria-label="advance generation"
                                    onClick={handleAdvancingGeneration}
                                    sx={{
                                        backgroundColor: "var(--secondary)",
                                        color: "#fff",
                                        "&:hover": {
                                            backgroundColor: "var(--primary)",
                                        },
                                    }}
                                >
                                    <FaPlay fontSize="large" />
                                </IconButton>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Typography
                        variant="h5"
                        sx={{
                            margin: "auto",
                            textAlign: "center",
                            width: "fit-content",
                            padding: "10px 20px",
                            backgroundColor: "var(--secondary)",
                            color: "var(--primary)",
                            borderRadius: "50px",
                            mt: 2,
                            mb: 2,
                        }}
                    >
                        Best Tournament
                    </Typography>
                    <Grid
                        container
                        spacing={4}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "center",
                            maxWidth: "800px",
                        }}
                    >
                        {(() => {
                            let formatProps: FormatProps;
                            const formats = geneticAlgorithm?.getFormat();
                            return formats?.length ? (
                                formats
                                    .map((format: FormatType) => {
                                        const numOfPlayers: number =
                                            formatProps?.topCut ||
                                            players.length;
                                        formatProps = mapToFormat(
                                            format,
                                            numOfPlayers
                                        );
                                        return formatProps;
                                    })
                                    .map((format, i) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                            key={format.type + i}
                                        >
                                            <Format format={format} />
                                        </Grid>
                                    ))
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        margin: "auto",
                                        textAlign: "center",
                                        mt: 3,
                                    }}
                                >
                                    No formats found!
                                </Typography>
                            );
                        })()}
                    </Grid>
                    <div
                        style={{
                            padding: "20px",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                margin: "auto",
                                textAlign: "center",
                                width: "fit-content",
                                padding: "10px 20px",
                                backgroundColor: "var(--secondary)",
                                color: "var(--primary)",
                                borderRadius: "50px",
                                mt: 2,
                            }}
                        >
                            Standings
                        </Typography>

                        {standings
                            ?.slice(0, showCount)
                            .map((player, index) => (
                                <RatingPlot key={index} player={player} />
                            ))}
                    </div>
                    <Button
                        onClick={() => setShowCount(showCount + 10)}
                        disabled={showCount >= players.length}
                        sx={{
                            margin: "auto",
                            marginTop: "1rem",
                            textAlign: "center",
                            width: "fit-content",
                            padding: "10px 20px",
                            backgroundColor: "var(--secondary)",
                            color: "var(--primary)",
                            borderRadius: "50px",
                        }}
                    >
                        Show More
                    </Button>
                </Box>
            ) : (
                <Typography variant="h5" color="text.secondary">
                    Invalid URL parameters.
                </Typography>
            )}
        </Box>
    );
};

export default Results;
