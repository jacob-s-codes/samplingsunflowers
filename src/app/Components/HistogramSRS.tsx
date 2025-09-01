import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
} from "recharts";

interface SampleMean {
    mean: number;
}

interface HistogramProps {
    sampleMeans: SampleMean[];
    trueMean: number;
    binCount?: number;
}

const Histogram: React.FC<HistogramProps> = ({
    sampleMeans,
    trueMean,
    binCount = 20,
}) => {
    // Convert sample means into histogram bins
    const data = useMemo(() => {
        if (!sampleMeans.length) return [];

        const values = sampleMeans.map((d) => d.mean);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binSize = (max - min) / binCount;

        const bins = Array.from({ length: binCount }, (_, i) => ({
            binStart: min + i * binSize,
            count: 0,
        }));

        values.forEach((val) => {
            let idx = Math.floor((val - min) / binSize);
            if (idx >= binCount) idx = binCount - 1; // edge case
            bins[idx].count++;
        });

        return bins.map((bin) => ({
            x: bin.binStart, // keep as number
            count: bin.count,
        }));

    }, [sampleMeans, binCount]);

    return (
        <ResponsiveContainer width="100%" height={410}>
            <BarChart data={data}>
                <CartesianGrid stroke="#ccc" />
                <XAxis
    dataKey="x"
    domain={['dataMin', 'dataMax']}
    type="number"
    label={{
        value: "Average number of healthy plants",
        position: "insideBottom",
        dy: 10,
    }}
    tickFormatter={(value) => value.toFixed(2)}
/>

                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />

                {/* True mean reference line */}
                <ReferenceLine
                    x={102.46}
                    stroke="red"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{
                        value: "True Mean",
                        position: "insideTopRight",
                        fill: "red",
                        fontSize: 12
                    }}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default Histogram;
