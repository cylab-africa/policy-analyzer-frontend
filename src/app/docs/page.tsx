import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import DocsSidebar, { type DocsHeading } from "@/components/docs/DocsSidebar";

// Content is read at build time; the runtime image does not include src/.
export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Documentation | Policy Analyzer",
    description:
        "The method behind the Policy Analyzer: indicators, evidence base, information extraction and analysis of data protection and digital identity policy across Africa.",
};

const content = fs.readFileSync(path.join(process.cwd(), "src/content/documentation.md"), "utf8");

const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

const textOf = (node: ReactNode): string => {
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(textOf).join("");
    return "";
};

// Build the table of contents from the ## and ### headings
const headings: DocsHeading[] = [];
for (const [, level, rawTitle] of content.matchAll(/^(#{2,3}) (.+)$/gm)) {
    const title = rawTitle.replace(/[*_]/g, "");
    const entry = { id: slugify(title), title };
    if (level === "##") {
        headings.push({ ...entry, children: [] });
    } else {
        headings.at(-1)?.children.push(entry);
    }
}

const components: Components = {
    h2: ({ children }) => (
        <h2
            id={slugify(textOf(children))}
            className="scroll-mt-24 text-2xl font-bold text-slate-900 mt-12 mb-4 pt-8 border-t border-border"
        >
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 id={slugify(textOf(children))} className="scroll-mt-24 text-lg font-semibold text-slate-900 mt-8 mb-3">
            {children}
        </h3>
    ),
    p: ({ children }) => <p className="text-slate-700 leading-relaxed mb-4">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-700">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 space-y-3 mb-4 text-slate-700">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
    a: ({ href, children }) => {
        const isExternal = href?.startsWith("http");
        return (
            <a
                href={href}
                className="text-primary font-medium underline underline-offset-2 hover:text-primary/80"
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
                {children}
            </a>
        );
    },
};

export default function DocsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-primary text-white py-12">
                <div className="max-w-7xl container mx-auto px-6">
                    <h1 className="text-3xl font-bold mb-2">Methodology</h1>
                    <p className="text-lg text-white/90 max-w-[700px]">
                        How the Policy Analyzer gathers, extracts and analyses policy information, and the limits of
                        its results
                    </p>
                </div>
            </div>

            <div className="max-w-7xl w-full container mx-auto px-6 py-10 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
                <aside className="hidden lg:block">
                    <nav aria-label="Documentation contents" className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            On this page
                        </p>
                        <DocsSidebar headings={headings} />
                    </nav>
                </aside>

                <details className="lg:hidden mb-8 rounded-lg border border-border bg-muted/50">
                    <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700">
                        On this page
                    </summary>
                    <nav aria-label="Documentation contents" className="px-4 pb-4">
                        <DocsSidebar headings={headings} />
                    </nav>
                </details>

                <article className="max-w-3xl min-w-0">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                        {content}
                    </ReactMarkdown>
                </article>
            </div>
        </div>
    );
}
