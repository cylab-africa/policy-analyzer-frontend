"use client";

import { useDigitalIdData, usePolicyLawData } from "@/redux/api/apiSlice";
import { AlertCircle, Loader2 } from "lucide-react";
import React from "react";

interface Segment {
    label: string;
    value: number;
    color: string;
}

// One topic at a glance: the headline number, then how all countries split across the statuses.
// The colours match the maps below.
const StatCard: React.FC<{
    title: string;
    count: number;
    total: number;
    countLabel: string;
    segments: Segment[];
}> = ({ title, count, total, countLabel, segments }) => (
    <section aria-label={title} className="rounded-2xl bg-white p-5 text-slate-900 shadow-xl sm:p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>

        <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <span className="text-5xl font-extrabold tabular-nums tracking-tight">{count}</span>
            <span className="text-base text-slate-600">
                of {total} {countLabel}
            </span>
        </p>

        <div
            role="img"
            aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(", ")}
            className="mt-4 flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-slate-100"
        >
            {segments.map(
                (segment) =>
                    segment.value > 0 && (
                        <span
                            key={segment.label}
                            className="h-full"
                            style={{ width: `${(segment.value / total) * 100}%`, backgroundColor: segment.color }}
                        />
                    )
            )}
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {segments.map((segment) => (
                <li key={segment.label} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-slate-600">
                        <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: segment.color }}
                        />
                        {segment.label}
                    </span>
                    <span className="font-semibold tabular-nums">{segment.value}</span>
                </li>
            ))}
        </ul>
    </section>
);

const HeroStatsSection: React.FC = () => {
    const law = usePolicyLawData();
    const id = useDigitalIdData();

    if (law.isLoading || id.isLoading) {
        return (
            <div className="rounded-2xl border border-white/20 bg-white/10 p-12 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-3 text-white/80">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="font-medium">Loading statistics...</span>
                </div>
            </div>
        );
    }

    if (law.error || id.error) {
        return (
            <div className="rounded-2xl border border-red-300/30 bg-white/10 p-8 text-center backdrop-blur-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100/20">
                    <AlertCircle className="h-6 w-6 text-red-200" />
                </div>
                <div className="mb-1 font-semibold text-white">Unable to load statistics</div>
                <div className="text-sm text-white/70">Please try again later</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <StatCard
                title="Data protection"
                count={law.enactedLaws}
                total={law.totalCountries}
                countLabel="countries have a data protection law"
                segments={[
                    { label: "Law enacted", value: law.enactedLaws, color: "#10b981" },
                    { label: "Draft", value: law.draftLaws, color: "#3b82f6" },
                    { label: "Limited", value: law.liteLaws, color: "#8b5cf6" },
                    { label: "No law", value: law.noLaws, color: "#6b7280" },
                ]}
            />
            <StatCard
                title="Digital identity"
                count={id.implementedSystems}
                total={id.totalCountries}
                countLabel="countries run a fully operational ID system"
                segments={[
                    { label: "Operational", value: id.implementedSystems, color: "#10b981" },
                    { label: "Partial", value: id.partialSystems, color: "#3b82f6" },
                    { label: "Planning", value: id.planningSystems, color: "#f59e0b" },
                    { label: "No info", value: id.noDataSystems, color: "#64748b" },
                ]}
            />
        </div>
    );
};

export default HeroStatsSection;
