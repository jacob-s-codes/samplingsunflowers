"use client";
import React, { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import Histogram from "./HistogramSRS";

const TableWithSample = () => {
    const data = [
        ["106", "104", "106", "105", "105", "105", "108", "108", "107", "106"],
        ["103", "102", "103", "104", "103", "103", "103", "104", "103", "105"],
        ["101", "99", "102", "101", "100", "100", "102", "101", "102", "101"],
        ["98", "99", "99", "99", "100", "99", "98", "101", "99", "101"],
        ["98", "100", "100", "100", "99", "99", "99", "98", "100", "98"],
        ["97", "98", "98", "98", "99", "99", "99", "99", "97", "98"],
        ["103", "102", "102", "104", "101", "102", "102", "102", "104", "102"],
        ["104", "103", "103", "103", "102", "102", "103", "104", "102", "102"],
        ["106", "106", "104", "106", "102", "107", "104", "103", "106", "106"],
        ["107", "108", "109", "110", "106", "107", "109", "107", "106", "107"],
    ];

    const flatData = data.flat().map((x) => Number(x));
    const totalCells = flatData.length;

    const [sampledCells, setSampledCells] = useState<number[]>([]);
    const [sampleValues, setSampleValues] = useState<number[]>([]);
    const [sampleMeans, setSampleMeans] = useState<{ x: number; mean: number }[]>([]);

    // Get 1 sample of size 10 and highlight it
    const handleSample = () => {
        const indices = Array.from({ length: totalCells }, (_, i) => i);
        const shuffled = indices.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);

        const values = selected.map((i) => flatData[i]);

        setSampledCells(selected);
        setSampleValues(values);
    };

    // Run 2000 samples, compute means, and plot
    const handleRunSimulation = () => {
        const means: { x: number; mean: number }[] = [];

        for (let i = 0; i < 2000; i++) {
            const indices = Array.from({ length: totalCells }, (_, j) => j);
            const shuffled = indices.sort(() => 0.5 - Math.random());
            const sample = shuffled.slice(0, 10).map((i) => flatData[i]);

            const mean = sample.reduce((a, b) => a + b, 0) / 10;
            means.push({ x: i + 1, mean });
        }

        setSampleMeans(means);
    };

    return (
        <div className="p-4 space-y-8 w-full flex flex-row items-center gap-x-12">
            <div className="w-1/2">
                {/* Controls */}
                <div className="flex items-center gap-4 pb-4">
                    <button
                        onClick={handleSample}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Get 1 Sample of 10
                    </button>
                    <button
                        onClick={handleRunSimulation}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Run 2000 Samples
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-10 gap-2">
                    {flatData.map((value, index) => (
                        <div
                            key={index}
                            className={`border border-gray-400 p-3 text-center rounded ${sampledCells.includes(index)
                                ? "bg-blue-300 font-bold"
                                : "bg-white"
                                }`}
                        >
                            {value}
                        </div>
                    ))}
                </div>

                {/* Display Current Sample */}
                {sampleValues.length > 0 && (
                    <div>

                        <p className="mt-2">
                            Mean:{" "}
                            <span className="font-bold">
                                {(
                                    sampleValues.reduce((a, b) => a + b, 0) / sampleValues.length
                                ).toFixed(2)}
                            </span>
                        </p>
                    </div>
                )}
            </div>

            {/* Graph of Means */}
            {sampleMeans.length > 0 && (
                <div className="h-80 w-full">
                    <h2 className="font-bold mb-4">Sampling Distribution of Means</h2>
                    {/* <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sampleMeans}>
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="x" tick={false} />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="mean" stroke="#8884d8" dot={false} />
                        </LineChart>
                    </ResponsiveContainer> */}
                    <Histogram sampleMeans={sampleMeans} trueMean={102} binCount={30} />
                </div>
            )}
        </div>
    );
};

export default TableWithSample;
