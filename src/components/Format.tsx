import { Box, Typography } from "@mui/material";
import { FormatProps } from "../views/Results";
import React from "react";

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

export default Format;
