import { useEffect, useState } from "react";
import Player from "../services/player";
import Plot from "react-plotly.js";
import jstat from "jstat";
import React from "react";

interface PerformanceDistributionPlotProps {
    players: Player[];
}

const GroupPlot: React.FC<PerformanceDistributionPlotProps> = ({ players }) => {
    const [plotData, setPlotData] = useState<Plotly.Data[]>([]);

    useEffect(() => {
        setPlotData(
            players.map((player) => {
                const l = player.invCDF(0.001);
                const r = player.invCDF(0.999);
                const xPerformance = jstat.seq(l, r, 50);
                const yPerformance = xPerformance.map((x: number) =>
                    player.getProbability(x)
                );

                return {
                    mode: "lines",
                    type: "scatter",
                    x: xPerformance,
                    y: yPerformance,
                    hoverinfo: "name",
                    name: player.getName(),
                };
            })
        );
    }, [players]);

    return (
        <div>
            <Plot
                data={plotData}
                layout={{
                    title: `First ${players.length} Players`,
                    yaxis: { visible: false },
                    showlegend: false,
                }}
                config={{ displaylogo: false }}
            />
        </div>
    );
};

export default GroupPlot;
