import React, { useEffect, useState } from "react";
import Player from "../services/player";
import Plot from "react-plotly.js";
import jstat from "jstat";

const performance_color = "#7F7F7F";
const rating_color = "#17BECF";

interface PerformanceDistributionPlotProps {
    player: Player;
}

const PerformanceDistributionPlot: React.FC<
    PerformanceDistributionPlotProps
> = ({ player }) => {
    const [plotData, setPlotData] = useState<Plotly.Data[]>([]);

    useEffect(() => {
        const l = player.invCDF(0.001);
        const r = player.invCDF(0.999);
        const ratings = player.getRatings();
        const min = Math.min(...ratings, l);
        const max = Math.max(...ratings, r);
        const range = jstat.seq(min, max, ratings.length);

        const xPerformance = jstat.seq(min, max, 100);
        const yPerformance = xPerformance.map((x: number) =>
            player.getProbability(x)
        );
        const CDFValues = xPerformance.map(
            (x: number) => player.getAccumulatedProbability(x) * 100
        );

        setPlotData([
            {
                mode: "lines",
                type: "scatter",
                x: xPerformance,
                y: yPerformance,
                text: CDFValues,
                name: "Performance PDF",
                hoverlabel: { bgcolor: "white" },
                line: { color: performance_color },
                hovertemplate:
                    "P(X <= %{x:.0f} ELO) is %{text:.2f}%<br>" +
                    "<extra></extra>",
                yaxis: "y1",
            },
            {
                y: [player.getProbability(player.getMean())],
                x: [player.getMean()],
                marker: { size: 10 },
                hoverinfo: "skip",
                mode: "markers",
                type: "scatter",
                name: "Mean",
            },
            {
                y: [player.getProbability(player.invCDF(0.5))],
                x: [player.invCDF(0.5)],
                marker: { size: 10 },
                hoverinfo: "skip",
                mode: "markers",
                type: "scatter",
                name: "Median",
            },
            {
                x: range,
                y: ratings,
                mode: "lines",
                name: "Rating",
                type: "scatter",
                yaxis: "y2",
                hoverinfo: "y",
                line: { color: rating_color },
                hovertemplate: "%{y:.0f} ELO" + "<extra></extra>",
            },
        ]);
    }, [player]);

    return (
        <div>
            <Plot
                data={plotData}
                layout={{
                    title: player.getName(),
                    xaxis: { color: "black" },
                    yaxis: {
                        side: "left",
                        overlaying: "y2",
                        color: performance_color,
                    },
                    legend: { orientation: "h" },
                    yaxis2: { color: rating_color, side: "right" },
                }}
                config={{ displaylogo: false }}
            />
        </div>
    );
};

export default PerformanceDistributionPlot;
