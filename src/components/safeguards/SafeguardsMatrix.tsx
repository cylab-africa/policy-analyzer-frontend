"use client";

import { cn } from "@/lib/utils";
import { DpiPrinciple, DpiRisk } from "@/types/api";
import { useMemo, useState } from "react";

// Categorical hues validated for CVD-safe all-pairs use via dataviz skill's
// validate_palette.js (aqua/yellow/violet slots 3-4-7 of the reference palette).
const RISK_CATEGORY_STYLE: Record<
    DpiRisk["category"],
    { dot: string; text: string; bg: string; ring: string }
> = {
    Safety: { dot: "bg-[#1baf7a] dark:bg-[#199e70]", text: "text-[#128a5f] dark:text-[#3fc796]", bg: "bg-[#1baf7a]/10", ring: "ring-[#1baf7a]" },
    Inclusion: { dot: "bg-[#eda100] dark:bg-[#c98500]", text: "text-[#8a5e00] dark:text-[#f0b830]", bg: "bg-[#eda100]/10", ring: "ring-[#eda100]" },
    "Structural Vulnerabilities": { dot: "bg-[#4a3aa7] dark:bg-[#9085e9]", text: "text-[#4a3aa7] dark:text-[#b3aaf0]", bg: "bg-[#4a3aa7]/10", ring: "ring-[#4a3aa7]" },
};

const PRINCIPLE_CATEGORY_STYLE: Record<DpiPrinciple["category"], { text: string; bg: string }> = {
    Foundational: { text: "text-primary", bg: "bg-primary" },
    Operational: { text: "text-secondary", bg: "bg-secondary" },
};

interface SafeguardsMatrixProps {
    principles: DpiPrinciple[];
    risks: DpiRisk[];
}

export default function SafeguardsMatrix({ principles, risks }: SafeguardsMatrixProps) {
    const [hovered, setHovered] = useState<{ riskCode: string; principleCode: string } | null>(null);
    const [pinnedPrinciple, setPinnedPrinciple] = useState<string | null>(null);
    const [pinnedRisk, setPinnedRisk] = useState<string | null>(null);

    const linkSet = useMemo(() => {
        const set = new Set<string>();
        risks.forEach((r) => r.associatedPrinciples.forEach((p) => set.add(`${r.code}:${p}`)));
        return set;
    }, [risks]);

    const activePrinciple = hovered?.principleCode ?? pinnedPrinciple ?? null;
    const activeRisk = hovered?.riskCode ?? pinnedRisk ?? null;

    const handleCellClick = (riskCode: string, principleCode: string) => {
        if (pinnedRisk === riskCode && pinnedPrinciple === principleCode) {
            setPinnedRisk(null);
            setPinnedPrinciple(null);
        } else {
            setPinnedRisk(riskCode);
            setPinnedPrinciple(principleCode);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Principle &harr; Risk map</h2>
                    <p className="text-sm text-gray-500">
                        Hover or focus a cell to see which principle mitigates which risk. Click to pin a pair.
                    </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                    {(Object.keys(RISK_CATEGORY_STYLE) as DpiRisk["category"][]).map((cat) => (
                        <span key={cat} className="flex items-center gap-1.5">
                            <span className={cn("h-2.5 w-2.5 rounded-full", RISK_CATEGORY_STYLE[cat].dot)} />
                            {cat}
                        </span>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                    {/* Column header: principle codes */}
                    <div className="flex">
                        <div className="w-56 shrink-0" />
                        <div className="flex">
                            {principles.map((p) => {
                                const isActiveCol = activePrinciple === p.code;
                                return (
                                    <div
                                        key={p.code}
                                        className={cn(
                                            "w-9 shrink-0 flex items-end justify-center pb-2 text-[10px] font-semibold",
                                            PRINCIPLE_CATEGORY_STYLE[p.category].text,
                                            isActiveCol && "underline"
                                        )}
                                        title={p.name}
                                    >
                                        {p.code}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Rows: risks */}
                    <div role="grid" aria-label="Principle to risk mapping matrix">
                        {risks.map((r) => {
                            const style = RISK_CATEGORY_STYLE[r.category];
                            const isActiveRow = activeRisk === r.code;
                            return (
                                <div
                                    key={r.code}
                                    className={cn(
                                        "flex items-center border-t border-gray-100",
                                        isActiveRow && style.bg
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-56 shrink-0 py-2 pr-3 flex items-center gap-2 text-sm",
                                            isActiveRow ? cn("font-semibold", style.text) : "text-gray-700"
                                        )}
                                    >
                                        <span className={cn("h-2 w-2 rounded-full shrink-0", style.dot)} />
                                        <span className="truncate" title={r.name}>
                                            {r.name}
                                        </span>
                                    </div>
                                    <div className="flex" role="row">
                                        {principles.map((p) => {
                                            const isLinked = linkSet.has(`${r.code}:${p.code}`);
                                            const isActiveCell =
                                                (activeRisk === r.code && activePrinciple === p.code) ||
                                                (activeRisk === r.code && !activePrinciple && isLinked) ||
                                                (activePrinciple === p.code && !activeRisk && isLinked);
                                            const isPinned = pinnedRisk === r.code && pinnedPrinciple === p.code;
                                            return (
                                                <button
                                                    key={p.code}
                                                    type="button"
                                                    role="gridcell"
                                                    disabled={!isLinked}
                                                    aria-label={
                                                        isLinked
                                                            ? `${p.code} ${p.name} mitigates ${r.name}`
                                                            : `${p.code} not linked to ${r.name}`
                                                    }
                                                    className={cn(
                                                        "w-9 h-9 shrink-0 flex items-center justify-center group",
                                                        isLinked ? "cursor-pointer" : "cursor-default"
                                                    )}
                                                    onMouseEnter={() =>
                                                        isLinked && setHovered({ riskCode: r.code, principleCode: p.code })
                                                    }
                                                    onMouseLeave={() => setHovered(null)}
                                                    onFocus={() =>
                                                        isLinked && setHovered({ riskCode: r.code, principleCode: p.code })
                                                    }
                                                    onBlur={() => setHovered(null)}
                                                    onClick={() => isLinked && handleCellClick(r.code, p.code)}
                                                >
                                                    {isLinked ? (
                                                        <span
                                                            className={cn(
                                                                "rounded-full transition-all",
                                                                style.dot,
                                                                isPinned
                                                                    ? "h-5 w-5 ring-2 ring-offset-1"
                                                                    : isActiveCell
                                                                    ? "h-5 w-5"
                                                                    : "h-3 w-3 opacity-70 group-hover:opacity-100"
                                                            )}
                                                        />
                                                    ) : (
                                                        <span className="h-1 w-1 rounded-full bg-gray-200" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {(hovered || (pinnedPrinciple && pinnedRisk)) && (
                <MatrixDetail
                    principle={principles.find((p) => p.code === activePrinciple)}
                    risk={risks.find((r) => r.code === activeRisk)}
                />
            )}
        </div>
    );
}

function MatrixDetail({ principle, risk }: { principle?: DpiPrinciple; risk?: DpiRisk }) {
    if (!principle || !risk) return null;
    const style = RISK_CATEGORY_STYLE[risk.category];
    return (
        <div className={cn("mt-4 rounded-lg p-4 border", style.bg)}>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Principle
                    </span>
                    <p className="font-semibold text-gray-900">
                        {principle.code} &middot; {principle.name}
                    </p>
                    <p className="text-sm text-gray-600">{principle.description}</p>
                </div>
                <div className="flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Risk</span>
                    <p className={cn("font-semibold", style.text)}>{risk.name}</p>
                    <p className="text-sm text-gray-600">{risk.description}</p>
                </div>
            </div>
        </div>
    );
}
