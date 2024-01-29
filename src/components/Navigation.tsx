import React from "react";
import { Link } from "react-router-dom";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Player from "../services/player";
import data from "../data/players";

const Navigation = () => {
    const navigate = useNavigate();

    const generateRandomData = () => {
        const players = [];
        const N = Math.floor(Math.random() * 20) + 10;

        for (let i = 0; i < N; i++) {
            const player = new Player();
            players.push({
                ratings: player.getRatings(),
                name: player.getName(),
            });
        }

        localStorage.setItem("players", JSON.stringify(players));
        navigate("/tournament");
    };

    const usePredefinedData = () => {
        localStorage.setItem("players", JSON.stringify(data));
        navigate("/tournament");
    };

    return (
        <Box
            sx={{
                mt: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Button
                variant="contained"
                color="primary"
                onClick={generateRandomData}
                sx={{
                    mb: 2,
                    background: "var(--secondary)",
                    "&:hover": {
                        backgroundColor: "rgba(var(--secondary-rgb), 0.8)",
                    },
                }}
            >
                Run Example on Random Data
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={usePredefinedData}
                sx={{
                    mb: 2,
                    background: "var(--secondary)",
                    "&:hover": {
                        backgroundColor: "rgba(var(--secondary-rgb), 0.8)",
                    },
                }}
            >
                Run Example on Real Data
            </Button>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/input-data"
                sx={{
                    mb: 2,
                    background: "var(--secondary)",
                    "&:hover": {
                        backgroundColor: "rgba(var(--secondary-rgb), 0.8)",
                    },
                }}
            >
                Input Your Own Data
            </Button>
        </Box>
    );
};

export default Navigation;
