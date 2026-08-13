"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import countryCoverageData from "@/data/country_principle_coverage.json";
import dpiPrinciplesData from "@/data/dpi_principles.json";
import dpiRisksData from "@/data/dpi_risks.json";
import { CountryCoverageData, DpiPrinciple, DpiRisk } from "@/types/api";
import { Globe2, Network, ShieldAlert, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import CountryCoverage from "./CountryCoverage";
import PrincipleOrbit from "./PrincipleOrbit";
import RisksRegister from "./RisksRegister";
import SafeguardsMatrix from "./SafeguardsMatrix";

const dpiPrinciples = dpiPrinciplesData as DpiPrinciple[];
const dpiRisks = dpiRisksData as DpiRisk[];
const countryCoverage = countryCoverageData as CountryCoverageData;

enum SafeguardsView {
    COUNTRIES = "countries",
    MAP = "map",
    PRINCIPLES = "principles",
    RISKS = "risks",
}

export default function SafeguardsPage() {
    const [activeView, setActiveView] = useState<SafeguardsView>(SafeguardsView.COUNTRIES);

    const foundationalPrinciples = useMemo(
        () => dpiPrinciples.filter((p) => p.category === "Foundational"),
        []
    );
    const operationalPrinciples = useMemo(
        () => dpiPrinciples.filter((p) => p.category === "Operational"),
        []
    );

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <div className="max-w-7xl container mx-auto px-6 pt-5 pb-16">
                <div className="mb-10">
                    <div className="bg-white rounded-lg shadow-md p-4 inline-flex">
                        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as SafeguardsView)}>
                            <TabsList className="grid grid-cols-4 h-12 min-w-[560px]">
                                <TabsTrigger
                                    value={SafeguardsView.COUNTRIES}
                                    className="flex items-center cursor-pointer justify-center gap-2 data-[state=active]:shadow-sm"
                                >
                                    <Globe2 className="h-4 w-4" />
                                    <span>Countries</span>
                                    <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                                        {countryCoverage.regions.reduce((sum, r) => sum + r.countries.length, 0)}
                                    </span>
                                </TabsTrigger>
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

                {activeView === SafeguardsView.COUNTRIES && (
                    <CountryCoverage data={countryCoverage} principles={dpiPrinciples} />
                )}

                {activeView === SafeguardsView.MAP && (
                    <SafeguardsMatrix principles={dpiPrinciples} risks={dpiRisks} />
                )}

                {activeView === SafeguardsView.PRINCIPLES && (
                    <div className="space-y-10">
                        <PrincipleOrbit
                            title="Foundational Principles"
                            principles={foundationalPrinciples}
                            risks={dpiRisks}
                            accent="primary"
                            defaultCode="F1"
                        />
                        <PrincipleOrbit
                            title="Operational Principles"
                            principles={operationalPrinciples}
                            risks={dpiRisks}
                            accent="secondary"
                            defaultCode="O1"
                        />
                    </div>
                )}

                {activeView === SafeguardsView.RISKS && (
                    <RisksRegister risks={dpiRisks} principles={dpiPrinciples} />
                )}
            </div>
        </div>
    );
}
