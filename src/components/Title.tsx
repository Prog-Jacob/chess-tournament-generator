import { Typography } from "@mui/material";
import React from "react";

function Title({ title }: { title: string }) {
    return (
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
                mb: 2,
            }}
        >
            {title}
        </Typography>
    );
}

export default Title;
