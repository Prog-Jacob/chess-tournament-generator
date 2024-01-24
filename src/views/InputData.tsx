import React, { useEffect, useState } from "react";
import {
    Button,
    Typography,
    TextField,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PlayerParameters } from "../types/player";

const InputData: React.FC = () => {
    const navigate = useNavigate();
    const [playerName, setPlayerName] = useState("");
    const [ratingsInput, setRatingsInput] = useState("");
    const [players, setPlayers] = useState<PlayerParameters[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleAddPlayer = () => {
        if (playerName && ratingsInput.trim().match(/^(\d+[\s,/-]+)*\d+$/)) {
            const ratings = [...ratingsInput.matchAll(/\d+/g)].map((match) =>
                parseInt(match[0])
            );
            const newPlayer = { name: playerName, ratings };

            setPlayerName("");
            setRatingsInput("");
            setPlayers([...players, newPlayer]);
            showSnackbar("Player added successfully!");
        } else {
            showSnackbar(
                "Invalid input. Please enter a valid player name and ratings."
            );
        }
    };

    const handleRemovePlayer = (index: number) => {
        const updatedPlayers = [...players];
        updatedPlayers.splice(index, 1);
        setPlayers(updatedPlayers);
        showSnackbar("Player removed successfully!");
    };

    const handleUploadFile = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files ?? [];

        for (const file of files) {
            await new Promise<void>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const content = e.target?.result as string;
                        const newPlayers: PlayerParameters[] = JSON.parse(
                            content
                        ).map((player: PlayerParameters) => ({
                            name: player.name,
                            ratings: (() => {
                                const ratings =
                                    player.ratings?.filter(
                                        (rating: number) => !isNaN(rating)
                                    ) ?? [];
                                return ratings.length ? ratings : [1500];
                            })(),
                        }));
                        setPlayers((prevPlayers) => [
                            ...prevPlayers,
                            ...newPlayers,
                        ]);
                        resolve();
                    } catch (error) {
                        resolve();
                    }
                };
                reader.readAsText(file);
            });
        }

        showSnackbar("All valid files processed successfully!");
    };

    const handleContinue = () => {
        localStorage.setItem("players", JSON.stringify(players));
        navigate("/tournament");
    };

    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const storedPlayers = localStorage.getItem("players");
        if (storedPlayers) {
            setPlayers(JSON.parse(storedPlayers));
        }
    }, []);

    return (
        <Box
            style={{
                backgroundColor: 'var(--background)',
                color: 'var(--secondary)',
                padding: '20px',
                borderRadius: '10px',
                maxWidth: '800px',
                margin: 'auto',
            }}
        >
            <Box mb={2}>
                <TextField
                    label="Player Name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="E.g. 1500, 1600, 1700"
                    value={ratingsInput}
                    onChange={(e) => setRatingsInput(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </Box>
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddPlayer}
                    fullWidth
                    style={{ backgroundColor: 'var(--secondary)' }}
                >
                    Add Player
                </Button>
            </Box>
            <Typography variant="h6" textAlign={"center"}>
                Or
            </Typography>
            <Box mb={2}>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    style={{ backgroundColor: 'var(--secondary)' }}
                >
                    Upload Files
                    <input type="file" hidden multiple accept=".json" onChange={handleUploadFile} />
                </Button>
            </Box>
            {players.length > 0 && (
                <Box mt={4}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold', minWidth: '100px' }}>Name</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', minWidth: '100px' }}>Ratings</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', minWidth: '100px' }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {players.map((player, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{player.name}</TableCell>
                                        <TableCell>{player.ratings?.join(', ')}</TableCell>
                                        <TableCell>
                                            <Button
                                                style={{ color: 'var(--secondary)' }}
                                                onClick={() => handleRemovePlayer(index)}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
            <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleContinue}
                    fullWidth
                    disabled={players.length === 0}
                    sx={{ '&:disabled': { backgroundColor: 'initial !important' } }}
                    style={{ backgroundColor: 'var(--secondary)' }}
                >
                    Continue to Tournament
                </Button>
            </Box>
            <Snackbar
                open={snackbarOpen}
                message={snackbarMessage}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            />
        </Box >
    );
};

export default InputData;
