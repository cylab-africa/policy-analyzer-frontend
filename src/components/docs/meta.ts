import { slugify } from "./primitives";

// Section and sub-section titles. They are defined once here, so that the headings, the table of
// contents and the links between sections can never disagree.
export const docMeta = {
    about: {
        title: "About this documentation",
        parts: {
            purpose: "Purpose",
            audience: "Who it is for",
            usage: "How to use it",
            takeaway: "What you should take away",
        },
    },
    features: { title: "What the Policy Analyzer does", parts: {} },
    built: { title: "How it is built", parts: {} },
    collection: {
        title: "How information was collected",
        parts: {
            reference: "Reference sources for the country indicators",
            documents: "Document collection for analysis",
            current: "Keeping the information current",
        },
    },
    indicators: {
        title: "Country indicators",
        parts: {
            dataProtection: "Data protection indicators",
            digitalId: "Digital identity indicators",
        },
    },
    extraction: { title: "Information extraction", parts: {} },
    analysis: {
        title: "Analysis method",
        parts: {
            framing: "Framing the question",
            locating: "Locating the evidence",
            supplementary: "Supplementary evidence",
            writing: "Writing the answer",
            batch: "Analysing many questions at once",
        },
    },
    insights: { title: "How insights are derived", parts: {} },
    verification: {
        title: "Verification and limitations",
        parts: {
            checked: "What has been checked",
            notChecked: "What has not been checked",
            limitations: "Limitations to keep in mind",
        },
    },
    run: {
        title: "Run your own instance",
        parts: {
            need: "What you need",
            backend: "Step 1: Set up the backend",
            frontend: "Step 2: Set up the website (Frontend)",
            documents: "Step 3: Add documents",
            gateway: "Connect an AI gateway",
            trouble: "If something goes wrong",
            online: "Before you put it online",
        },
    },
    extend: { title: "Fork and extend", parts: {} },
    feedback: { title: "Feedback and corrections", parts: {} },
} as const;

export type DocKey = keyof typeof docMeta;

// When the documentation was last reviewed. Update it whenever the content changes.
export const DOCS_LAST_UPDATED = "November 2026";

// Link to a section of this page
export const anchor = (title: string) => `#${slugify(title)}`;
