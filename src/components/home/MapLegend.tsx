"use client";

import React from "react";

export interface LegendItem {
    status: string;
    label: string;
    color: string;
    count: number;
}

interface MapLegendProps {
    items: LegendItem[];
    active: string | null;
    onChange: (status: string | null) => void;
}

// Legend that doubles as a filter: picking a status dims every other country on the map.
const MapLegend: React.FC<MapLegendProps> = ({ items, active, onChange }) => {
    return (
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-6 border-b border-slate-100 bg-white">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Filter</span>
            {items.map((item) => {
                const selected = active === item.status;
                const dimmed = active !== null && !selected;
                return (
                    <button
                        key={item.status}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onChange(selected ? null : item.status)}
                        className={`group inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 focus-ring ${
                            selected
                                ? "border-slate-800 bg-slate-900 text-white shadow-sm"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        } ${dimmed ? "opacity-60" : ""}`}
                    >
                        <span
                            className="h-2.5 w-2.5 rounded-full ring-2 ring-white/80"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.label}</span>
                        <span
                            className={`rounded-full px-1.5 text-xs font-bold tabular-nums ${
                                selected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                            }`}
                        >
                            {item.count}
                        </span>
                    </button>
                );
            })}
            {active !== null && (
                <button
                    type="button"
                    onClick={() => onChange(null)}
                    className="cursor-pointer rounded-full px-2 py-1 text-xs font-medium text-slate-500 underline underline-offset-2 hover:text-slate-800 focus-ring"
                >
                    Clear
                </button>
            )}
        </div>
    );
};

export default MapLegend;
