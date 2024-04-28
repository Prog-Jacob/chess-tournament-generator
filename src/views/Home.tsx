import React from "react";
import Navigation from "../components/Navigation";
import { Box, Container, Typography } from "@mui/material";

const HomePage = () => {
    return (
        <Container component="main" sx={{ flex: 1, mt: 4 }}>
            <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" gutterBottom>
                    Welcome to Our Application
                </Typography>
                <Typography variant="h5" paragraph>
                    Choose an option to get started:
                </Typography>
                <Navigation />
            </Box>
        </Container>
    );
};

export default HomePage;
