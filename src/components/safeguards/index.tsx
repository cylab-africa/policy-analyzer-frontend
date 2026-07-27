"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dpiPrinciplesData from "@/data/dpi_principles.json";
import dpiRisksData from "@/data/dpi_risks.json";
import { DpiPrinciple, DpiRisk } from "@/types/api";
import { Network, ShieldAlert, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import SafeguardsMatrix from "./SafeguardsMatrix";

const dpiPrinciples = dpiPrinciplesData as DpiPrinciple[];
const dpiRisks = dpiRisksData as DpiRisk[];

enum SafeguardsView {
    MAP = "map",
    PRINCIPLES = "principles",
    RISKS = "risks",
}

const riskCategoryOrder = ["Safety", "Inclusion", "Structural Vulnerabilities"] as const;

export default function SafeguardsPage() {
    const [activeView, setActiveView] = useState<SafeguardsView>(SafeguardsView.MAP);

    const foundationalPrinciples = useMemo(
        () => dpiPrinciples.filter((p) => p.category === "Foundational"),
        []
    );
    const operationalPrinciples = useMemo(
        () => dpiPrinciples.filter((p) => p.category === "Operational"),
        []
    );

    const risksByCategory = useMemo(() => {
        return riskCategoryOrder.map((category) => ({
            category,
            risks: dpiRisks.filter((r) => r.category === category),
        }));
    }, []);

    const principleByCode = useMemo(() => {
        const map = new Map<string, DpiPrinciple>();
        dpiPrinciples.forEach((p) => map.set(p.code, p));
        return map;
    }, []);

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <div className="max-w-7xl container mx-auto px-6 pt-5 pb-16">
                <div className="mb-10">
                    <div className="bg-white rounded-lg shadow-md p-4 inline-flex">
                        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as SafeguardsView)}>
                            <TabsList className="grid grid-cols-3 h-12 min-w-[420px]">
                                <TabsTrigger
                                    value={SafeguardsView.MAP}
                                    className="flex items-center cursor-pointer justify-center gap-2 data-[state=active]:shadow-sm"
                                >
                                    <Network className="h-4 w-4" />
                                    <span>Map</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value={SafeguardsView.PRINCIPLES}
                                    className="flex items-center cursor-pointer justify-center gap-2 data-[state=active]:shadow-sm"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>Principles</span>
                                    <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                                        {dpiPrinciples.length}
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value={SafeguardsView.RISKS}
                                    className="flex items-center cursor-pointer justify-center gap-2 data-[state=active]:shadow-sm"
                                >
                                    <ShieldAlert className="h-4 w-4" />
                                    <span>Risks</span>
                                    <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                                        {dpiRisks.length}
                                    </span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {activeView === SafeguardsView.MAP && (
                    <SafeguardsMatrix principles={dpiPrinciples} risks={dpiRisks} />
                )}

                {activeView === SafeguardsView.PRINCIPLES && (
                    <div className="space-y-10">
                        <PrincipleGroup title="Foundational Principles" principles={foundationalPrinciples} />
                        <PrincipleGroup title="Operational Principles" principles={operationalPrinciples} />
                    </div>
                )}

                {activeView === SafeguardsView.RISKS && (
                    <div className="space-y-10">
                        {risksByCategory.map(({ category, risks }) => (
                            <div key={category}>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 pl-3 border-l-4 border-primary">
                                    {category}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {risks.map((risk) => (
                                        <div key={risk.code} className="bg-white rounded-lg shadow-sm p-5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="outline">{risk.code}</Badge>
                                                <h3 className="font-semibold text-gray-900">{risk.name}</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {risk.associatedPrinciples.map((code) => (
                                                    <Badge key={code} variant="secondary" title={principleByCode.get(code)?.name}>
                                                        {code}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function PrincipleGroup({ title, principles }: { title: string; principles: DpiPrinciple[] }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pl-3 border-l-4 border-primary">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {principles.map((principle) => (
                    <div key={principle.code} className="bg-white rounded-lg shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge>{principle.code}</Badge>
                            <h3 className="font-semibold text-gray-900">{principle.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{principle.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
