"use client";

import { cn } from "@/lib/utils";
import { DpiPrinciple, DpiRisk } from "@/types/api";
import { Building2, ShieldAlert, Users } from "lucide-react";
import { useMemo, useState } from "react";

interface RisksRegisterProps {
    risks: DpiRisk[];
    principles: DpiPrinciple[];
}

// Categorical hues validated for CVD-safe all-pairs use via dataviz skill's
// validate_palette.js (aqua/yellow/violet slots 3-4-7 of the reference palette).
export const RISK_CATEGORY_STYLE: Record<
    DpiRisk["category"],
    { dot: string; text: string; bg: string; ring: string; border: string }
> = {
    Safety: { dot: "bg-[#1baf7a] dark:bg-[#199e70]", text: "text-[#128a5f] dark:text-[#3fc796]", bg: "bg-[#1baf7a]/10", ring: "ring-[#1baf7a]", border: "border-l-[#1baf7a]" },
    Inclusion: { dot: "bg-[#eda100] dark:bg-[#c98500]", text: "text-[#8a5e00] dark:text-[#f0b830]", bg: "bg-[#eda100]/10", ring: "ring-[#eda100]", border: "border-l-[#eda100]" },
    "Structural Vulnerabilities": { dot: "bg-[#4a3aa7] dark:bg-[#9085e9]", text: "text-[#4a3aa7] dark:text-[#b3aaf0]", bg: "bg-[#4a3aa7]/10", ring: "ring-[#4a3aa7]", border: "border-l-[#4a3aa7]" },
};

const CATEGORY_ORDER = ["Safety", "Inclusion", "Structural Vulnerabilities"] as const;

const CATEGORY_ICON: Record<DpiRisk["category"], typeof ShieldAlert> = {
    Safety: ShieldAlert,
    Inclusion: Users,
    "Structural Vulnerabilities": Building2,
};

export default function RisksRegister({ risks, principles }: Readonly<RisksRegisterProps>) {
    const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(
        () => principles[0]?.code ?? null
    );

    const principleByCode = useMemo(() => {
        const map = new Map<string, DpiPrinciple>();
        principles.forEach((p) => map.set(p.code, p));
        return map;
    }, [principles]);

    const risksByCategory = useMemo(
        () =>
            CATEGORY_ORDER.map((category) => ({
                category,
                risks: risks.filter((r) => r.category === category),
            })),
        [risks]
    );

    const maxCoverage = useMemo(
        () => Math.max(1, ...risks.map((r) => r.associatedPrinciples.length)),
        [risks]
    );

    const active = selectedPrinciple ? principleByCode.get(selectedPrinciple) ?? null : null;

    return (
        <div className="flex flex-col xl:flex-row gap-6 items-start">
            <div className="flex-1 min-w-0 w-full space-y-10">
                {risksByCategory.map(({ category, risks: categoryRisks }) => {
                    const style = RISK_CATEGORY_STYLE[category];
                    const Icon = CATEGORY_ICON[category];
                    return (
                        <div key={category}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={cn("inline-flex items-center justify-center h-9 w-9 rounded-lg", style.bg)}>
                                    <Icon className={cn("h-4.5 w-4.5", style.text)} />
                                </span>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{category}</h2>
                                    <p className="text-xs text-gray-500">
                                        {categoryRisks.length} risk{categoryRisks.length === 1 ? "" : "s"}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100 overflow-hidden">
                                {categoryRisks.map((risk) => {
                                    const coverage = risk.associatedPrinciples.length;
                                    const coveragePct = Math.round((coverage / maxCoverage) * 100);
                                    return (
                                        <div
                                            key={risk.code}
                                            className={cn(
                                                "flex gap-4 p-5 border-l-4 transition-colors hover:bg-gray-50/80",
                                                style.border
                                            )}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <span
                                                        className={cn(
                                                            "text-xs font-bold px-2 py-0.5 rounded-full",
                                                            style.bg,
                                                            style.text
                                                        )}
                                                    >
                                                        {risk.code}
                                                    </span>
                                                    <h3 className="font-semibold text-gray-900">{risk.name}</h3>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
                                                <div>
                                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                                        Mitigated by &middot; click to view
                                                    </span>
                                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                        {risk.associatedPrinciples.map((code) => {
                                                            const isSelected = selectedPrinciple === code;
                                                            return (
                                                                <button
                                                                    key={code}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setSelectedPrinciple(isSelected ? null : code)
                                                                    }
                                                                    title={`View ${principleByCode.get(code)?.name ?? code}`}
                                                                    className={cn(
                                                                        "text-xs font-medium pl-2 pr-2.5 py-1 rounded-full border cursor-pointer transition-all hover:shadow-sm hover:-translate-y-px",
                                                                        isSelected
                                                                            ? cn(style.bg, style.text, "border-current shadow-sm")
                                                                            : "bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                                                    )}
                                                                >
                                                                    {code}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-32 shrink-0 hidden sm:flex flex-col items-end justify-center gap-1.5">
                                                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                                    Coverage
                                                </span>
                                                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full", style.dot)}
                                                        style={{ width: `${coveragePct}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {coverage} principle{coverage === 1 ? "" : "s"}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="w-full xl:w-96 shrink-0 xl:sticky xl:top-5">
                {active ? (
                    <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                        <div className="px-5 py-4 bg-gradient-to-br from-gray-800 to-gray-700 text-white flex items-center gap-3">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/15 text-base font-bold shrink-0">
                                {active.code}
                            </span>
                            <div className="min-w-0">
                                <h3 className="font-semibold leading-tight">{active.name}</h3>
                                <p className="text-xs opacity-75 mt-0.5">{active.category} principle</p>
                            </div>
                        </div>
                        <div className="p-5 bg-white">
                            <p className="text-sm text-gray-600 leading-relaxed">{active.description}</p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-400 bg-gray-50/50">
                        Click a principle code on any risk card to see what it means.
                    </div>
                )}
            </div>
        </div>
    );
}
