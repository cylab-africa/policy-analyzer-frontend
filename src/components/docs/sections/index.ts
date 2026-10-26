import type { ComponentType } from "react";
import { docMeta, type DocKey } from "../meta";
import { slugify } from "../primitives";
import type { DocsHeading } from "../DocsSidebar";
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

// The sections of the documentation page, in reading order.
// To add a section: add its titles to ../meta.ts, create the component, and list it here.
export const docSections: { key: DocKey; Component: ComponentType }[] = [
    { key: "about", Component: AboutSection },
    { key: "features", Component: FeaturesSection },
    { key: "built", Component: BuiltSection },
    { key: "collection", Component: CollectionSection },
    { key: "indicators", Component: IndicatorsSection },
    { key: "extraction", Component: ExtractionSection },
    { key: "analysis", Component: AnalysisSection },
    { key: "insights", Component: InsightsSection },
    { key: "verification", Component: VerificationSection },
    { key: "run", Component: RunSection },
    { key: "extend", Component: ExtendSection },
    { key: "feedback", Component: FeedbackSection },
];

// The table of contents lists the main sections, built from the same titles the sections render
export const docHeadings: DocsHeading[] = docSections.map(({ key }) => {
    const { title } = docMeta[key];
    return { id: slugify(title), title };
});
