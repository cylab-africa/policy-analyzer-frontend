import type { ComponentType } from "react";
import { docMeta, type DocKey } from "../meta";
import { slugify } from "../primitives";
import type { DocsGroup } from "../DocsSidebar";
import { AboutSection } from "./AboutSection";
import { AnalysisSection } from "./AnalysisSection";
import { BuiltSection } from "./BuiltSection";
import { CollectionSection } from "./CollectionSection";
import { ExtendSection } from "./ExtendSection";
import { ExtractionSection } from "./ExtractionSection";
import { FeaturesSection } from "./FeaturesSection";
import { FeedbackSection } from "./FeedbackSection";
import { IndicatorsSection } from "./IndicatorsSection";
import { InsightsSection } from "./InsightsSection";
import { RunSection } from "./RunSection";
import { VerificationSection } from "./VerificationSection";

const components: Record<DocKey, ComponentType> = {
    about: AboutSection,
    features: FeaturesSection,
    built: BuiltSection,
    collection: CollectionSection,
    indicators: IndicatorsSection,
    extraction: ExtractionSection,
    analysis: AnalysisSection,
    insights: InsightsSection,
    verification: VerificationSection,
    run: RunSection,
    extend: ExtendSection,
    feedback: FeedbackSection,
};

// The sections of the documentation page, in reading order, in the groups the contents list shows.
// To add a section: add its titles to ../meta.ts, create the component, add it above and list it here.
const groups: { label: string; keys: DocKey[] }[] = [
    { label: "Start here", keys: ["features", "about"] },
    {
        label: "How it works",
        keys: ["built", "collection", "indicators", "extraction", "analysis", "insights", "verification"],
    },
    { label: "Run and extend", keys: ["run", "extend", "feedback"] },
];

export const docSections: { key: DocKey; Component: ComponentType }[] = groups
    .flatMap((group) => group.keys)
    .map((key) => ({ key, Component: components[key] }));

// The contents list shows the main sections, built from the same titles the sections render
export const docGroups: DocsGroup[] = groups.map((group) => ({
    label: group.label,
    headings: group.keys.map((key) => {
        const { title } = docMeta[key];
        return { id: slugify(title), title };
    }),
}));
