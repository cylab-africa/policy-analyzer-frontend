import type { Metadata } from "next";
import DocsSidebar from "@/components/docs/DocsSidebar";
import { docHeadings, docSections } from "@/components/docs/sections";
import { IntroSection } from "@/components/docs/sections/IntroSection";

export const metadata: Metadata = {
    title: "Documentation | Policy Analyzer",
    description:
        "What the Policy Analyzer does, how it was built and how it produces its results, how its information was collected and checked, and how to run or extend your own copy.",
};

export default function DocsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-primary text-white py-12">
                <div className="max-w-7xl container mx-auto px-6">
                    <h1 className="text-3xl font-bold mb-2">Documentation</h1>
                    <p className="text-lg text-white/90 max-w-[700px]">
                        What the Policy Analyzer does, how it was built and how it produces its results, and how to
                        run or extend your own copy
                    </p>
                </div>
            </div>

            <div className="max-w-7xl w-full container mx-auto px-6 py-10 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
                <aside className="hidden lg:block">
                    <nav aria-label="Documentation contents" className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            On this page
                        </p>
                        <DocsSidebar headings={docHeadings} />
                    </nav>
                </aside>

                <details className="lg:hidden mb-8 rounded-lg border border-border bg-muted/50">
                    <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700">
                        On this page
                    </summary>
                    <nav aria-label="Documentation contents" className="px-4 pb-4">
                        <DocsSidebar headings={docHeadings} />
                    </nav>
                </details>

                <article className="max-w-3xl min-w-0">
                    <IntroSection />
                    {docSections.map(({ key, Component }) => (
                        <Component key={key} />
                    ))}
                </article>
            </div>
        </div>
    );
}
