import GeneticAlgorithm from "../services/genetic_algorithm/genetic_algorithm";
import { PlayerParameters, PlayerProfile } from "../types/player";
import { Format as FormatType } from "../types/formats";
import ProgressPlot from "../components/ProgressPlot";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RatingPlot from "../components/RatingPlot";
import { shuffleArray } from "../utils/array";
import { mapToFormat } from "../utils/format";
import Format from "../components/Format";
import Player from "../services/player";
import { FaPlay } from "react-icons/fa";
import Title from "../components/Title";
import {
    Box,
    Grid,
    Paper,
    Button,
    TextField,
    IconButton,
    Typography,
} from "@mui/material";

export interface FormatProps {
    type: string;
    topCut: number;
    players: number;
    matches: number;
    gamesPerMatch: number;
}

const Results = () => {
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState<string>();
    const [round, setRound] = useState<number>();
    const [geneticAlgorithm, setGeneticAlgorithm] =
        useState<GeneticAlgorithm>();
    const [input, setInput] = useState<string>("");
    const [showCount, setShowCount] = useState(10);
    const [progress, setProgress] = useState<number[]>([]);
    const [standings, setStandings] = useState<Player[]>();
    const [generation, setGeneration] = useState<number>(0);
    const [players, setPlayers] = useState<PlayerProfile[]>([]);

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
        if (isNaN(num) || num < 1 || num > 100) {
            alert("Please enter a valid number between 1 and 100.");
        } else {
            geneticAlgorithm?.advanceGenerationBy(num);
            setGeneration((generation) => generation + num);
            setStandings(() => [
                ...(geneticAlgorithm?.getTournamentResults() || []),
            ]);
            setProgress(
                (progress) => geneticAlgorithm?.getProgress() || progress
            );
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
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            mt: 4,
                            position: "fixed",
                            top: "50px",
                            left: "30px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1000,
                        }}
                    >
                        <Grid item xs={12} sm={6} mb={2}>
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
                                    Rounds: {round}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper
                                sx={{
                                    p: 3,
                                    boxShadow: 2,
                                    borderRadius: 2,
                                    backgroundColor: "#f7f7f7",
                                }}
                            >
                                <TextField
                                    type="number"
                                    id="standard-number"
                                    label="Advance Generations"
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
                    </Box>
                    {(() => {
                        let formatProps: FormatProps;
                        const formats = geneticAlgorithm?.getFormat();
                        return formats?.length ? (
                            <Box
                                sx={{
                                    mt: 4,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {!progress.length || (
                                    <ProgressPlot progress={[...progress]} />
                                )}
                                <Title title="Suggested Tournament" />
                                <Grid
                                    container
                                    spacing={4}
                                    mb={4}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        maxWidth: "800px",
                                    }}
                                >
                                    {formats
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
                                        ))}
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
                                    <Title title="Standings" />

                                    {standings
                                        ?.slice(0, showCount)
                                        .map((player, index) => (
                                            <RatingPlot
                                                key={index}
                                                player={player}
                                            />
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
                            <Typography
                                variant="body1"
                                sx={{
                                    margin: "auto",
                                    textAlign: "center",
                                    mt: 3,
                                }}
                            >
                                No data found, try advancing generations!
                            </Typography>
                        );
                    })()}
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
