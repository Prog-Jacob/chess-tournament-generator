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
        const l = player.cdf(0.001);
        const r = player.cdf(0.999);
        const ratings = player.getRatings();
        const min = Math.min(...ratings, l);
        const max = Math.max(...ratings, r);
        const range = jstat.seq(min, max, ratings.length);

        const xPerformance = jstat.seq(min, max, max - min + 1);
        const yPerformance = xPerformance.map((x: number) =>
            player.getProbability(x)
        );
        const CDFValues = xPerformance.map(
            (x: number) => player.getAccumulatedProbability(x) * 100
        );

        setPlotData([
            {
                type: "scatter",
                mode: "lines",
                x: xPerformance,
                y: yPerformance,
                line: { color: performance_color },
                name: "Performance PDF",
                yaxis: "y1",
                hovertemplate:
                    "P(X <= %{x} ELO) is %{text:.2f}%<br>" + "<extra></extra>",
                text: CDFValues,
                hoverlabel: { bgcolor: "white" },
            },
            {
                x: [player.getMean()],
                y: [player.getProbability(player.getMean())],
                mode: "markers",
                type: "scatter",
                marker: { size: 10 },
                name: "Mean",
                hoverinfo: "skip",
            },
            {
                x: [player.cdf(0.5)],
                y: [player.getProbability(player.cdf(0.5))],
                mode: "markers",
                type: "scatter",
                marker: { size: 10 },
                name: "Median",
                hoverinfo: "skip",
            },
            {
                type: "scatter",
                mode: "lines",
                x: range,
                y: ratings,
                line: { color: rating_color },
                name: "Rating",
                yaxis: "y2",
                hoverinfo: "y",
                hovertemplate: "%{y} ELO" + "<extra></extra>",
            },
        ]);
    }, []);

    return (
        <div>
            <Plot
                data={plotData}
                layout={{
                    title: player.getName(),
                    xaxis: { color: "black" },
                    yaxis: {
                        color: performance_color,
                        side: "left",
                        overlaying: "y2",
                    },
                    yaxis2: { color: rating_color, side: "right" },
                    legend: { orientation: "h" },
                }}
                config={{ displaylogo: false }}
            />
        </div>
    );
};

export default PerformanceDistributionPlot;
