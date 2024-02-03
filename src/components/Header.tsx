import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

function Header() {
    return (
        <AppBar
            position="static"
            sx={{ marginBottom: "1rem", backgroundColor: "var(--secondary)" }}
        >
            <Toolbar>
                <Typography
                    sx={{ margin: "auto" }}
                    color="inherit"
                    variant="h6"
                >
                    Chess Tournament Generator
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
