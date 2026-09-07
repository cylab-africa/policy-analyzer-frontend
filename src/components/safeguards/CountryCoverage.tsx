"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    CountryCoverageData,
    CountryPrincipleCoverage,
    CoverageStatus,
    DpiPrinciple,
} from "@/types/api";
import { ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

/** Countries with a published clause-level evidence dossier. */
const DOSSIER_ROUTES: Record<string, string> = {
    Kenya: "/safeguards/kenya",
};

interface CountryCoverageProps {
    data: CountryCoverageData;
    principles: DpiPrinciple[];
}

const STATUS_STYLE: Record<
    CoverageStatus,
    { bg: string; border: string; fill: "full" | "half" | "none"; text: string; label: string }
> = {
    addressed: {
        bg: "bg-[#1baf7a] dark:bg-[#3fc796]",
        border: "border-[#1baf7a] dark:border-[#3fc796]",
        fill: "full",
        text: "text-[#1baf7a] dark:text-[#3fc796]",
        label: "Addressed",
    },
    partial: {
        bg: "bg-[#eda100] dark:bg-[#f0b830]",
        border: "border-[#eda100] dark:border-[#f0b830]",
        fill: "half",
        text: "text-[#eda100] dark:text-[#f0b830]",
        label: "Partial / indirect",
    },
    not_addressed: {
        bg: "bg-gray-300 dark:bg-gray-600",
        border: "border-gray-300 dark:border-gray-600",
        fill: "none",
        text: "text-gray-300 dark:text-gray-600",
        label: "Not addressed",
    },
};

function StatusGlyph({ status, size = 14 }: { status: CoverageStatus; size?: number }) {
    const style = STATUS_STYLE[status];
    return (
        <span
            className={cn("inline-block rounded-full border-2 shrink-0 relative overflow-hidden", style.border)}
            style={{ width: size, height: size }}
        >
            {style.fill === "full" && <span className={cn("absolute inset-0", style.bg)} />}
            {style.fill === "half" && <span className={cn("absolute inset-y-0 left-0 w-1/2", style.bg)} />}
        </span>
    );
}

const STATUS_WEIGHT: Record<CoverageStatus, number> = {
    addressed: 1,
    partial: 0.5,
    not_addressed: 0,
};

export default function CountryCoverage({ data, principles }: CountryCoverageProps) {
    const [search, setSearch] = useState("");
    const [hoveredPrinciple, setHoveredPrinciple] = useState<string | null>(null);
    const [collapsedRegions, setCollapsedRegions] = useState<Set<string>>(
        () => new Set(data.regions.slice(1).map((r) => r.region)),
    );

    const principleByCode = useMemo(() => {
        const map = new Map<string, DpiPrinciple>();
        principles.forEach((p) => map.set(p.code, p));
        return map;
    }, [principles]);

    const filteredRegions = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return data.regions;
        return data.regions
            .map((r) => ({
                ...r,
                countries: r.countries.filter(
                    (c) => c.country.toLowerCase().includes(q) || c.law.toLowerCase().includes(q),
                ),
            }))
            .filter((r) => r.countries.length > 0);
    }, [data.regions, search]);

    const scoreOf = (c: CountryPrincipleCoverage) => {
        const values = data.principleCodes.map((code) => STATUS_WEIGHT[c.status[code]] ?? 0);
        return values.reduce((a, b) => a + b, 0) / data.principleCodes.length;
    };

    const toggleRegion = (region: string) => {
        setCollapsedRegions((prev) => {
            const next = new Set(prev);
            if (next.has(region)) next.delete(region);
            else next.add(region);
            return next;
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="mb-4 pb-5 border-b border-gray-100">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-900">Country coverage</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search country or law..."
                            className="pl-9 pr-8 h-9 w-80 text-sm"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-sm text-gray-600 max-w-3/6 mt-1">
                    Hover a column to trace one principle across countries. Where an evidence dossier
                    exists, open it to see each rating traced to the statute.
                </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap mb-4">
                {(Object.keys(STATUS_STYLE) as CoverageStatus[]).map((s) => (
                    <span key={s} className="flex items-center gap-1.5">
                        <StatusGlyph status={s} />
                        {STATUS_STYLE[s].label}
                    </span>
                ))}
            </div>

            <div>
                <div className="overflow-x-auto">
                    <div className="min-w-[760px]">
                        {/* Column headers */}
                        <div className="flex sticky top-0 bg-white z-10">
                            <div className="w-44 shrink-0" />
                            <div className="w-14 shrink-0" />
                            <div className="flex">
                                {data.principleCodes.map((code) => (
                                    <button
                                        key={code}
                                        type="button"
                                        onMouseEnter={() => setHoveredPrinciple(code)}
                                        onMouseLeave={() => setHoveredPrinciple(null)}
                                        onFocus={() => setHoveredPrinciple(code)}
                                        onBlur={() => setHoveredPrinciple(null)}
                                        title={principleByCode.get(code)?.description}
                                        className={cn(
                                            "w-9 shrink-0 flex items-end justify-center pb-2 text-xs font-semibold cursor-default transition-colors",
                                            hoveredPrinciple === code ? "text-primary underline" : "text-gray-600",
                                        )}
                                    >
                                        {code}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredRegions.map((region) => {
                            const isCollapsed = collapsedRegions.has(region.region);
                            return (
                                <div key={region.region} className="mt-3">
                                    <button
                                        type="button"
                                        onClick={() => toggleRegion(region.region)}
                                        className="flex items-center gap-2 w-full text-left border-b border-gray-200 hover:border-gray-300 py-2 cursor-pointer"
                                    >
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 shrink-0 text-gray-500 transition-transform",
                                                isCollapsed && "-rotate-90",
                                            )}
                                        />
                                        <span className="text-sm font-bold uppercase tracking-wide text-gray-800">
                                            {region.region}
                                        </span>
                                        <span className="text-xs font-medium text-gray-500">
                                            {region.countries.length} {region.countries.length === 1 ? "country" : "countries"}
                                        </span>
                                    </button>

                                    {!isCollapsed && (
                                        <div role="grid" aria-label={`${region.region} principle coverage`}>
                                            {region.countries.map((c) => {
                                                const score = scoreOf(c);
                                                return (
                                                    <div
                                                        key={c.country}
                                                        role="row"
                                                        className="flex items-center border-t border-gray-100 hover:bg-gray-50"
                                                    >
                                                        <div className="w-44 shrink-0 py-2 pr-3 flex items-center gap-2 text-sm min-w-0 text-gray-700">
                                                            <span className="shrink-0">{c.flagEmoji}</span>
                                                            <div className="min-w-0">
                                                                <div className="truncate">{c.country}</div>
                                                                <div className="text-[10px] text-gray-400 truncate">
                                                                    {c.law}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-14 shrink-0 flex items-center">
                                                            <div className="w-10 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full bg-primary"
                                                                    style={{ width: `${score * 100}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex" role="row">
                                                            {data.principleCodes.map((code) => {
                                                                const status = c.status[code];
                                                                const style = STATUS_STYLE[status];
                                                                const isActiveCol = hoveredPrinciple === code;
                                                                const hasCaveat = Boolean(c.caveats?.[code]);
                                                                return (
                                                                    <div
                                                                        key={code}
                                                                        role="gridcell"
                                                                        title={`${code} ${
                                                                            principleByCode.get(code)?.name ?? ""
                                                                        }: ${style.label}${
                                                                            hasCaveat
                                                                                ? `\n\nNote: ${c.caveats?.[code]}`
                                                                                : ""
                                                                        }`}
                                                                        className={cn(
                                                                            "w-9 h-9 shrink-0 flex items-center justify-center relative",
                                                                            isActiveCol && "bg-primary/5",
                                                                        )}
                                                                    >
                                                                        <StatusGlyph status={status} />
                                                                        {hasCaveat && (
                                                                            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-secondary" />
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="w-28 shrink-0 pl-4 flex justify-end">
                                                            {DOSSIER_ROUTES[c.country] && (
                                                                <Link
                                                                    href={DOSSIER_ROUTES[c.country]}
                                                                    title={`Open the ${c.country} evidence dossier — every rating traced to the statute`}
                                                                    className="rounded-md border border-primary/40 bg-white px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary hover:text-white hover:border-primary transition-colors"
                                                                >
                                                                    View details
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {filteredRegions.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-10">
                                No country matches &quot;{search}&quot;.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
