"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDigitalIdData, usePolicyLawData } from "@/redux/api/apiSlice";
import { useState } from "react";
import DataProtectionMap from "./DataProtectionMap";
import DigitalIDMap from "./DigitalIDMap";

type Lens = "data-protection" | "digital-id";

const LENSES: {
    value: Lens;
    title: string;
    blurb: string;
    figure: string;
    activeCard: string;
}[] = [
    {
        value: "data-protection",
        title: "Data Protection",
        blurb: "Who has a law, since when, and who has signed the Malabo Convention.",
        figure: "Legislation status by African Union member state",
        activeCard: "data-[state=active]:border-emerald-700 data-[state=active]:bg-emerald-700",
    },
    {
        value: "digital-id",
        title: "Digital Identity",
        blurb: "Which national ID systems are running, still rolling out, or only planned.",
        figure: "Digital ID implementation by African Union member state",
        activeCard: "data-[state=active]:border-blue-700 data-[state=active]:bg-blue-700",
    },
];

const TabSection = () => {
    const [lens, setLens] = useState<Lens>("data-protection");
    const law = usePolicyLawData();
    const id = useDigitalIdData();

    // The headline is built from the same records the maps use, so it cannot drift from them
    const headline =
        lens === "data-protection"
            ? law.totalCountries > 0
                ? {
                      lead: `${law.enactedLaws} of ${law.totalCountries}`,
                      rest: `African Union member states have enacted a dedicated data protection law. ${law.malaboRatified} have ratified the Malabo Convention.`,
                  }
                : null
            : id.totalCountries > 0
              ? {
                    lead: `${id.implementedSystems} of ${id.totalCountries}`,
                    rest: `African Union member states run a fully operational national digital ID system. ${id.partialSystems} more are partly implemented and ${id.planningSystems} are still planning one.`,
                }
              : null;

    const active = LENSES.find((l) => l.value === lens)!;

    return (
        <section className="relative overflow-hidden bg-slate-50 py-16 lg:py-24">
            {/* Soft atlas backdrop */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                    backgroundImage:
                        "radial-gradient(60rem 30rem at 15% 0%, rgb(16 185 129 / 0.08), transparent 60%), radial-gradient(50rem 28rem at 90% 10%, rgb(59 130 246 / 0.08), transparent 60%)",
                }}
            />

            <div className="relative max-w-7xl container mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto mb-10 max-w-4xl text-center lg:mb-14">
                    <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 lg:text-5xl">
                        Two lenses on Africa&apos;s digital governance
                    </h2>
                    <p className="text-lg leading-relaxed text-slate-600">
                        Choose a topic below. The map, the numbers and the filters all change with it. Click any
                        country to see its details and sources.
                    </p>
                </div>

                <Tabs value={lens} onValueChange={(v) => setLens(v as Lens)} className="w-full gap-8">
                    {/* Lens selector: the selected card is filled, the other stays white */}
                    <TabsList className="mx-auto grid h-auto w-full max-w-4xl grid-cols-1 gap-4 bg-transparent p-0 sm:grid-cols-2">
                        {LENSES.map((item) => (
                            <TabsTrigger
                                key={item.value}
                                value={item.value}
                                className={`group h-auto cursor-pointer flex-col items-start justify-start gap-2 whitespace-normal rounded-2xl border-2 border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:border-slate-400 hover:shadow-md data-[state=active]:shadow-lg ${item.activeCard}`}
                            >
                                <span className="flex w-full items-center justify-between gap-3">
                                    <span className="text-xl font-bold text-slate-900 group-data-[state=active]:text-white">
                                        {item.title}
                                    </span>
                                    <span className="shrink-0 rounded-full border border-slate-300 px-2.5 py-0.5 text-xs font-semibold text-slate-500 group-data-[state=active]:border-white/40 group-data-[state=active]:bg-white/15 group-data-[state=active]:text-white">
                                        <span className="group-data-[state=active]:hidden">Click to view</span>
                                        <span className="hidden group-data-[state=active]:inline">Showing now</span>
                                    </span>
                                </span>
                                <span className="text-sm leading-relaxed text-slate-600 group-data-[state=active]:text-white/90">
                                    {item.blurb}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* The takeaway for the chosen lens */}
                    <div className="mx-auto min-h-[5.5rem] max-w-3xl text-center" aria-live="polite">
                        {headline && (
                            <p className="text-xl leading-relaxed text-slate-700 lg:text-2xl">
                                <span className="mr-2 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
                                    {headline.lead}
                                </span>
                                {headline.rest}
                            </p>
                        )}
                    </div>

                    {/* The map, framed like a figure in an atlas */}
                    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                        <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-slate-100 px-4 py-3 sm:px-6">
                            <span className="text-sm font-semibold text-slate-800">
                                {active.title}: {active.figure}
                            </span>
                            <span className="hidden text-xs text-slate-500 sm:block">
                                Hover to preview, click to pin
                            </span>
                        </figcaption>

                        <TabsContent value="data-protection" className="focus:outline-none">
                            <DataProtectionMap />
                        </TabsContent>
                        <TabsContent value="digital-id" className="focus:outline-none">
                            <DigitalIDMap />
                        </TabsContent>
                    </figure>
                </Tabs>
            </div>
        </section>
    );
};

export default TabSection;
