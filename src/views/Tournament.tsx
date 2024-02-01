import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import RatingPlot from "../components/RatingPlot";
import Player from "../services/player";
import { PlayerParameters } from "../types/player";
import GroupPlot from "../components/GroupsPlot";

const Tournament = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState("Fair");
    const [players, setPlayers] = useState([]);
    const [numRounds, setNumRounds] = useState("");
    const [showCount, setShowCount] = useState(10);

    useEffect(() => {
        const playersParameters =
            JSON.parse(localStorage.getItem("players")!) || [];
        const newPlayers = playersParameters.map(
            (player: PlayerParameters) =>
                new Player(player.ratings, player.name)
        );
        setPlayers(() => newPlayers);
    }, []);

    const handleExecuteTournament = () => {
        navigate(`/results?rounds=${numRounds}&mode=${mode}`);
    };

    return (
        <Box
            style={{
                backgroundColor: "var(--background)",
                color: "var(--secondary)",
                padding: "20px",
                borderRadius: "10px",
                maxWidth: "800px",
                margin: "auto",
            }}
        >
            <Box mt={3} mb={3}>
                <Typography
                    variant="h5"
                    sx={{
                        margin: "auto",
                        marginBottom: "1rem",
                        textAlign: "center",
                        width: "fit-content",
                        padding: "10px 20px",
                        backgroundColor: "var(--secondary)",
                        color: "var(--primary)",
                        borderRadius: "50px",
                    }}
                >
                    Options
                </Typography>
                <FormControl fullWidth>
                    <TextField
                        id="num-rounds"
                        type="number"
                        value={numRounds}
                        placeholder="Number of rounds"
                        onChange={(e) => setNumRounds(e.target.value)}
                        fullWidth
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel htmlFor="mode">Mode</InputLabel>
                    <Select
                        id="mode"
                        value={mode}
                        label="Mode"
                        onChange={(e) => setMode(e.target.value || "Fair")}
                        fullWidth
                    >
                        <MenuItem value="Exciting">Exciting</MenuItem>
                        <MenuItem value="Fair">Fair</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={handleExecuteTournament}
                fullWidth
                sx={{ mb: 2 }}
                style={{ background: "var(--secondary)" }}
            >
                Execute Tournament
            </Button>

            <Box mt={3}>
                <Typography
                    variant="h5"
                    sx={{
                        margin: "auto",
                        marginBottom: "1rem",
                        textAlign: "center",
                        width: "fit-content",
                        padding: "10px 20px",
                        backgroundColor: "var(--secondary)",
                        color: "var(--primary)",
                        borderRadius: "50px",
                    }}
                >
                    Players
                </Typography>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px",
                        borderRadius: "10px",
                    }}
                >
                    {players.length ? (
                        <GroupPlot players={players.slice(0, showCount)} />
                    ) : (
                        <></>
                    )}
                    {players.slice(0, showCount).map((player, index) => (
                        <RatingPlot key={index} player={player} />
                    ))}
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
                </div>
            </Box>
        </Box>
    );
};

export default Tournament;
