import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingPlot from '../components/RatingPlot'; // Assuming you have a RatingPlot component
import Player from '../services/player';
import { PlayerParameters } from '../types/player';

const Tournament = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [numRounds, setNumRounds] = useState(1);
    const [mode, setMode] = useState('Exciting');

    useEffect(() => {
        const playersParameters = JSON.parse(localStorage.getItem('players')!);
        const newPlayers = playersParameters.map((player: PlayerParameters) => (new Player(player.ratings, player.name)));
        setPlayers(newPlayers);
    }, []);

    const handleExecuteTournament = () => {
        navigate(`/format?rounds=${numRounds}&mode=${mode}`);
    };

    return (
        <div>
            <h1>Tournament Page</h1>
            <div>
                <h2>Tournament Options</h2>
                <label>
                    Number of Rounds:{' '}
                    <input
                        type="number"
                        value={numRounds}
                        onChange={(e) => setNumRounds(parseInt(e.target.value))}
                    />
                </label>
                <br />
                <label>
                    Mode:{' '}
                    <select value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="Exciting">Exciting</option>
                        <option value="Fair">Fair</option>
                    </select>
                </label>
            </div>
            <button onClick={handleExecuteTournament}>Execute Tournament</button>

            <div>
                <h2>Player Ratings</h2>
                {players.map((player, index) => (
                    <RatingPlot key={index} player={player} />
                ))}
            </div>
        </div>
    );
};

export default Tournament;