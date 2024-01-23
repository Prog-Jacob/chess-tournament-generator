import React from "react";
import { Link } from "react-router-dom";
import { Button, Box } from "@mui/material";

const Navigation = () => {
    return (
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: "center" }}>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/run-random"
                sx={{
                    mb: 2, background: "var(--secondary)", '&:hover': {
                        backgroundColor: 'rgba(var(--secondary-rgb), 0.8)',
                    },
                }}            >
                Run Example on Random Data
            </Button>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/run-real"
                sx={{
                    mb: 2, background: "var(--secondary)", '&:hover': {
                        backgroundColor: 'rgba(var(--secondary-rgb), 0.8)',
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
                    mb: 2, background: "var(--secondary)", '&:hover': {
                        backgroundColor: 'rgba(var(--secondary-rgb), 0.8)',
                    },
                }}            >
                Input Your Own Data
            </Button>
        </Box>
    );
};

export default Navigation;
