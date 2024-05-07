import { AppBar, Button, Link, Toolbar, Typography } from "@mui/material";
import React from "react";

function Header() {
    return (
        <AppBar
            position="static"
            sx={{ marginBottom: "1rem", backgroundColor: "var(--secondary)" }}
        >
            <Toolbar>
                <Button
                    sx={{ margin: "auto" }}
                    color="inherit"
                    component={Link}
                    href="/"
                >
                    <Typography color="inherit" variant="h6">
                        Chess Tournament Generator
                    </Typography>
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
