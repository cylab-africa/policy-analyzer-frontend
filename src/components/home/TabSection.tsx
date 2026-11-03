"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDigitalIdData, usePolicyLawData } from "@/redux/api/apiSlice";
import { useState } from "react";
import DataProtectionMap from "./DataProtectionMap";
import DigitalIDMap from "./DigitalIDMap";
import FolderTabs from "./FolderTabs";

type Lens = "data-protection" | "digital-id";

const LENSES: { value: Lens; label: string }[] = [
    { value: "data-protection", label: "Data Protection" },
    { value: "digital-id", label: "Digital Identity" },
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

    return (
        <section className="bg-slate-50 py-16 lg:py-24">
            <div className="max-w-7xl container mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto mb-10 max-w-4xl text-center lg:mb-14">
                    <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 lg:text-5xl">
                        Two lenses on Africa&apos;s digital governance
                    </h2>
                    <p className="text-lg leading-relaxed text-slate-600">
                        Choose a topic with the tabs. The map, the numbers and the filters all change with it. Click
                        any country to see its details and sources.
                    </p>
                </div>

                <Tabs value={lens} onValueChange={(v) => setLens(v as Lens)} className="w-full gap-0">
                    {/* Folder tabs: the selected one is raised and joins the map below, the other sits behind it */}
                    <FolderTabs tabs={LENSES} />

                    {/* The map panel, attached to the tabs */}
                    <figure className="relative overflow-hidden rounded-2xl rounded-tl-none border border-slate-200 bg-white shadow-xl shadow-slate-200/60 max-sm:rounded-tr-none">
                        <figcaption
                            className="min-h-[5.5rem] border-b border-slate-100 px-5 py-5 sm:px-8"
                            aria-live="polite"
                        >
                            {headline && (
                                <p className="text-lg leading-relaxed text-slate-700 lg:text-xl">
                                    <span className="mr-2 text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
                                        {headline.lead}
                                    </span>
                                    {headline.rest}
                                </p>
                            )}
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
