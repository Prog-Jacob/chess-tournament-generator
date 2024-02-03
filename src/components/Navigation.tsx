import { useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
import Player from "../services/player";
import { Link } from "react-router-dom";
import data from "../data/players";
import React from "react";

const Navigation = () => {
    const navigate = useNavigate();

    const generateRandomData = () => {
        const players = [];
        const N = Math.floor(Math.random() * 20) + 10;

        for (let i = 0; i < N; i++) {
            const player = new Player();
            players.push({
                name: player.getName(),
                ratings: player.getRatings(),
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
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Button
                color="primary"
                variant="contained"
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
                color="primary"
                variant="contained"
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
                color="primary"
                component={Link}
                to="/input-data"
                variant="contained"
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
