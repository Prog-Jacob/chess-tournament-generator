import React from "react";
import Plot from "react-plotly.js";
import Player from "../services/player";
import { useEffect, useState } from "react";
import jstat from "jstat";

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
                    type: "scatter",
                    mode: "lines",
                    x: xPerformance,
                    y: yPerformance,
                    hoverinfo: "name",
                    name: player.getName(),
                };
            })
        );
    }, []);

    return (
        <div>
            <Plot
                data={plotData}
                layout={{
                    title: `First ${players.length} Players`,
                    showlegend: false,
                    yaxis: { visible: false },
                }}
                config={{ displaylogo: false }}
            />
        </div>
    );
};

export default GroupPlot;
