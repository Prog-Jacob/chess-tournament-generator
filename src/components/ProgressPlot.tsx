import React from "react";
import Plot from "react-plotly.js";
import { useEffect, useState } from "react";

const ProgressPlot = ({ progress }: { progress: number[] }) => {
    const [plotData, setPlotData] = useState<Plotly.Data[]>([]);

    const movingAverage = () => {
        const windowSize = Math.min(20, Math.ceil(progress.length / 10));
        const max = Math.max(...progress.slice(0, windowSize));
        let sum = windowSize * max;

        return progress.map((val, i) => {
            sum += val;
            sum -= i < windowSize ? max : progress[i - windowSize];
            return sum / windowSize;
        });
    };

    useEffect(() => {
        const x = Array.from({ length: progress.length }, (_, i) => i + 1);
        setPlotData([
            {
                type: "scatter",
                mode: "lines",
                x: x,
                y: [...progress],
                hovertemplate:
                    "Error of generation %{x} is %{y:.2f}<extra></extra>",
            },
            {
                type: "scatter",
                mode: "lines",
                x: x,
                y: movingAverage(),
                hovertemplate:
                    "Average error around generation %{x} is %{y:.2f}<extra></extra>",
            },
        ]);
    }, [progress]);

    return (
        <div>
            <Plot
                data={plotData}
                config={{ displaylogo: false }}
                layout={{
                    title: "Progress",
                    showlegend: false,
                    yaxis: { title: "Error" },
                    xaxis: { title: "Generation" },
                }}
            />
        </div>
    );
};

export default ProgressPlot;
