"use client";

import { cn } from "@/lib/utils";
import { DpiPrinciple, DpiRisk } from "@/types/api";
import { useMemo, useState } from "react";

interface PrincipleOrbitProps {
    title: string;
    principles: DpiPrinciple[];
    risks: DpiRisk[];
    accent: "primary" | "secondary";
    defaultCode?: string;
}

const ACCENT = {
    primary: {
        hub: "bg-primary text-primary-foreground",
        ring: "stroke-primary/25",
        line: "stroke-primary",
        node: "bg-primary/15 text-primary border-primary/30",
        nodeActive: "bg-primary text-primary-foreground border-primary",
        chipActive: "bg-primary text-primary-foreground border-primary",
        cardHeader: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
        cardBorder: "border-primary/20",
        badgeSoft: "bg-primary/10 text-primary",
    },
    secondary: {
        hub: "bg-secondary text-secondary-foreground",
        ring: "stroke-secondary/25",
        line: "stroke-secondary",
        node: "bg-secondary/15 text-secondary border-secondary/30",
        nodeActive: "bg-secondary text-white border-secondary",
        chipActive: "bg-secondary text-white border-secondary",
        cardHeader: "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground",
        cardBorder: "border-secondary/20",
        badgeSoft: "bg-secondary/10 text-secondary",
    },
} as const;

const SIZE = 620;
const CENTER = SIZE / 2;
const RADIUS = 250;
const HUB_SIZE = 156;

export default function PrincipleOrbit({ title, principles, risks, accent, defaultCode }: Readonly<PrincipleOrbitProps>) {
    const [activeCode, setActiveCode] = useState<string | null>(defaultCode ?? null);
    const style = ACCENT[accent];

    const weightByCode = useMemo(() => {
        const map = new Map<string, DpiRisk[]>();
        principles.forEach((p) => map.set(p.code, []));
        risks.forEach((r) => {
            r.associatedPrinciples.forEach((code) => {
                if (map.has(code)) map.get(code)!.push(r);
            });
        });
        return map;
    }, [principles, risks]);

    const maxWeight = useMemo(
        () => Math.max(1, ...principles.map((p) => weightByCode.get(p.code)?.length ?? 0)),
        [principles, weightByCode]
    );

    const positions = useMemo(() => {
        return principles.map((p, i) => {
            const angle = (i / principles.length) * Math.PI * 2 - Math.PI / 2;
            return {
                code: p.code,
                x: CENTER + RADIUS * Math.cos(angle),
                y: CENTER + RADIUS * Math.sin(angle),
            };
        });
    }, [principles]);

    const active = principles.find((p) => p.code === activeCode) ?? null;
    const activeRisks = activeCode ? weightByCode.get(activeCode) ?? [] : [];

    return (
        <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500">
                        Node size = how many risks it mitigates. Click a node to inspect it.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
                <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
                    <svg
                        width={SIZE}
                        height={SIZE}
                        viewBox={`0 0 ${SIZE} ${SIZE}`}
                        className="absolute inset-0"
                    >
                        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" className={cn(style.ring)} strokeWidth={1} />
                        {positions.map((pos) => {
                            const isActive = activeCode === pos.code;
                            return (
                                <line
                                    key={pos.code}
                                    x1={CENTER}
                                    y1={CENTER}
                                    x2={pos.x}
                                    y2={pos.y}
                                    className={isActive ? style.line : "stroke-gray-200"}
                                    strokeWidth={isActive ? 2 : 1}
                                    style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
                                />
                            );
                        })}
                    </svg>

                    <button
                        type="button"
                        onClick={() => setActiveCode(null)}
                        className={cn(
                            "absolute rounded-full flex flex-col items-center justify-center gap-1 text-center shadow-lg cursor-pointer transition-transform hover:scale-105 px-4",
                            style.hub
                        )}
                        style={{
                            width: HUB_SIZE,
                            height: HUB_SIZE,
                            left: CENTER - HUB_SIZE / 2,
                            top: CENTER - HUB_SIZE / 2,
                        }}
                        title="Clear selection"
                    >
                        {active ? (
                            <>
                                <span className="text-2xl text-white font-bold leading-none">{active.code}</span>
                                <span className="text-sm text-white/70 font-medium leading-tight line-clamp-2">
                                    {active.name}
                                </span>
                            </>
                        ) : (
                            <span className="text-base font-bold leading-tight">{title.split(" ")[0]}</span>
                        )}
                    </button>

                    {positions.map((pos) => {
                        const p = principles.find((pp) => pp.code === pos.code)!;
                        const weight = weightByCode.get(pos.code)?.length ?? 0;
                        const isActive = activeCode === pos.code;
                        const scale = 0.55 + (weight / maxWeight) * 0.45;
                        const nodeSize = 26 * scale + 18;
                        return (
                            <button
                                key={pos.code}
                                type="button"
                                onClick={() => setActiveCode(isActive ? null : pos.code)}
                                aria-pressed={isActive}
                                aria-label={`${p.code} ${p.name}, mitigates ${weight} risk${weight === 1 ? "" : "s"}`}
                                className={cn(
                                    "absolute rounded-full border-2 flex flex-col items-center justify-center font-bold cursor-pointer transition-all hover:scale-110 hover:shadow-md",
                                    isActive ? style.nodeActive : style.node
                                )}
                                style={{
                                    width: nodeSize,
                                    height: nodeSize,
                                    left: pos.x - nodeSize / 2,
                                    top: pos.y - nodeSize / 2,
                                    fontSize: 12,
                                }}
                                title={`${p.name} — mitigates ${weight} risk${weight === 1 ? "" : "s"}`}
                            >
                                {p.code}
                            </button>
                        );
                    })}
                </div>

                <div className="flex-1 min-w-0 w-full">
                    {active ? (
                        <div
                            className={cn(
                                "rounded-xl border shadow-sm overflow-hidden animate-fade-in-up",
                                style.cardBorder
                            )}
                            style={{ animationDuration: "0.3s" }}
                        >
                            <div className={cn("px-5 py-4 flex items-center gap-3", style.cardHeader)}>
                                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-base font-bold shrink-0">
                                    {active.code}
                                </span>
                                <div className="min-w-0 text-white text-xl">
                                    <h3 className="font-semibold leading-tight">{active.name}</h3>
                                </div>
                            </div>

                            <div className="p-5 bg-white">
                                <p className="text-md text-gray-600 leading-relaxed mb-4">{active.description}</p>

                                <span className="text-[12px] font-semibold uppercase tracking-wide text-gray-600">
                                    Mitigates {activeRisks.length} risk{activeRisks.length === 1 ? "" : "s"}
                                </span>
                                {activeRisks.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {activeRisks.map((r) => (
                                            <span
                                                key={r.code}
                                                title={r.description}
                                                className={cn(
                                                    "text-sm px-2.5 py-1 rounded-full font-medium",
                                                    style.badgeSoft
                                                )}
                                            >
                                                {r.code} &middot; {r.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 mt-1">
                                        No risk in the current register cites this principle directly.
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-400 bg-gray-50/50">
                            Select a node to see its description and which risks it mitigates.
                        </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-4">
                        {principles.map((p) => {
                            const isActive = activeCode === p.code;
                            return (
                                <button
                                    key={p.code}
                                    type="button"
                                    onClick={() => setActiveCode(isActive ? null : p.code)}
                                    className={cn(
                                        "text-xs px-2 py-1 rounded-full border font-medium transition-colors cursor-pointer",
                                        isActive ? style.chipActive : "bg-white text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    {p.code}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
