import type { Metadata } from "next";
import { DocsLayout } from "@/components/docs/DocsSidebar";
import { DOCS_LAST_UPDATED } from "@/components/docs/meta";
import { docGroups, docSections } from "@/components/docs/sections";
import { IntroSection } from "@/components/docs/sections/IntroSection";

export const metadata: Metadata = {
    title: "Documentation | Policy Analyzer",
    description:
        "What the Policy Analyzer does, how it was built and how it produces its results, how its information was collected and checked, and how to run or extend your own copy.",
};

export default function DocsPage() {
    return (
        <div className="container mx-auto max-w-7xl px-6 pb-16 pt-10">
            <header className="mb-8 max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Documentation</h1>
                <p className="mt-2 text-md leading-relaxed text-slate-600">
                    What the Policy Analyzer does, how it was built and how it produces its results, and how to run or
                    extend your own copy.
                </p>
                <p className="mt-3 text-sm text-slate-500">Last updated {DOCS_LAST_UPDATED}</p>
            </header>

            <DocsLayout groups={docGroups}>
                <article className="min-w-0 max-w-[50rem] pt-6 lg:pt-0">
                    <IntroSection />
                    {docSections.map(({ key, Component }) => (
                        <Component key={key} />
                    ))}
                </article>
            </DocsLayout>
        </div>
    );
}
